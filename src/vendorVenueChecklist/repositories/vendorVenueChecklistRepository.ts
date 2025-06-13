import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import config from 'config';
import { randomUUID } from 'crypto';
import TYPES from '../../dependencyManager/types';
import {
  AddVenueChecklistDto,
  CreateVenueChecklistDto,
  ImageUploadData,
  QuestionsDto,
  TypeValidationDetailsDTO,
  VendorVenueDetails,
} from '../dto/vendorVenueChecklist.dto';
import { COMMON } from '../../utils/common';
import { prepareImageData, repositoryError } from '../../utils/utils';
import { S3Service } from '../../libs/s3Service';
import { isBase64Image } from '../../utils/isBase64Image';
import { NotFoundError } from '../../error/notFoundError';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class VendorVenueChecklistRepository {
  private readonly prisma: PrismaClient;

  private readonly s3Service: S3Service;

  private readonly s3Url: string;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.S3Service) s3Service: S3Service,
  ) {
    this.prisma = prisma;
    this.s3Service = s3Service;
    this.s3Url = config.get<string>('aws.s3Url');
  }

  async addVenueCheckList(data: AddVenueChecklistDto) {
    try {
      const {
        venueName,
        contactName,
        vendorId,
        phoneNumber,
        email,
        createdBy,
        updatedBy,
      }: CreateVenueChecklistDto = data;
      return await this.prisma.$transaction(async (prisma) => {
        const venuCheckList: CreateVenueChecklistDto =
          await prisma.vendorVenue.create({
            data: {
              vendorId,
              venueName,
              contactName,
              phoneNumber,
              email,
              createdBy,
              updatedBy,
            },
          });

        const questions: QuestionsDto[] =
          await this.processImagesAndUpdateQuestions(data?.questions);
        const vendorData: Prisma.BatchPayload =
          await prisma.vendorQuestionResponse.createMany({
            data: questions?.flatMap((item: QuestionsDto) => {
              if (
                !item.questionOptionId ||
                item.questionOptionId.length === 0
              ) {
                return [
                  {
                    vendorId: data.vendorId,
                    questionId: item.questionId,
                    customValue: item.customValue ?? null,
                    fileURL: item.fileURL ?? null,
                    createdBy: data.createdBy,
                    updatedBy: data.updatedBy,
                  },
                ];
              }
              return item.questionOptionId.map((optionId: number) => ({
                vendorId: data.vendorId,
                questionId: item.questionId,
                questionOptionId: optionId,
                customValue: item.customValue ?? '',
                fileURL: item.fileURL ?? '',
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
              }));
            }),
          });
        return { venuCheckList, data: vendorData };
      });
    } catch (err: unknown) {
      const error = err as Error;
      repositoryError(error);
    }
  }

  async findQuestionById(questionId: number) {
    return this.prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        questionOptions: {
          select: {
            id: true,
            option: true,
          },
        },
      },
    });
  }

  async findQuestionAndTypevalidationById(
    questionId: number,
  ): Promise<TypeValidationDetailsDTO | null> {
    try {
      return await this.prisma.questionValidation.findMany({
        where: { questionId },
        select: {
          id: true,
          questionId: true,
          typeValidation: true,
        },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  private processImagesAndUpdateQuestions: (
    questions: QuestionsDto[],
  ) => Promise<QuestionsDto[]> = async (questions: QuestionsDto[]) => {
    return Promise.all(
      questions?.map(async (item) => {
        const question: QuestionsDto = { ...item };
        if (question?.customValue && isBase64Image(question?.customValue)) {
          const imageData: ImageUploadData = {
            photo: question.customValue,
            name: `${COMMON.VENDOR_VENUE_CHECKLIST}-${randomUUID()}`,
          };
          const basePath: string = COMMON.VENDOR_IMGAGE_PATH;
          imageData.photo = question.customValue;

          const { key, imageBuffer, contentType } = prepareImageData(
            imageData.photo,
            imageData.name,
            basePath,
          );

          await this.s3Service.uploadImage({
            key,
            body: imageBuffer,
            contentType,
          });
          const imageUrl: string = `${this.s3Url}/${key}`;
          question.fileURL = imageUrl;
          question.customValue = '';
        }
        return question;
      }),
    );
  };

  async vendorById(id: number) {
    const vendor: {
      id: number;
    } | null = await this.prisma.vendor.findUnique({
      where: { id },
      select: { id: true},
    });
    return vendor ? vendor?.id : null;
  }


  async getVendorVenueCheckListDetails(vendorId: number): Promise<VendorVenueDetails[]| null> {
    try {
        const vendorVenues = await this.prisma.vendorVenue.findMany({
            where: { vendorId },
            select: {
                id: true,
                contactName: true,
                venueName: true,
                email: true,
                phoneNumber: true,
                vendorId: true
            }
        });
        if(!vendorVenues.length){
          throw new NotFoundError(MESSAGES.VENDOR_VENUE_NOT_FOUND(vendorId))
        }
        const vendorQuestions = await this.prisma.vendorQuestionResponse.findMany({
          where: {
              vendorId,
              question: {
                  questionCategoryId: 2 
              }
          },
          include: {
              question: {
                  include: {
                      questionType: true,
                  }
              },
              questionOption: true
          }
      });
       
        const formattedData: VendorVenueDetails[] = vendorVenues.map(venue => ({
            id: venue.id,
            contactName: venue.contactName,
            venueName: venue.venueName,
            email: venue.email,
            phoneNumber: venue.phoneNumber,
            vendorId: venue.vendorId,
            questions: vendorQuestions
                .filter(vqr => vqr.question) 
                .map(vqr => ({
                    id: vqr.question.id,
                    name: vqr.question.question,
                    type: vqr.question.questionType?.name || "N/A",
                    questionOptions: vqr.questionOption,
                    customValue : vqr.customValue,
                    fileURL : vqr.fileURL
                }))
            
        }));

        return formattedData;
    } catch (err: unknown) {
      repositoryError(err);
    }
}

}
