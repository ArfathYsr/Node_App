import { Prisma, PrismaClient, vendorRoom ,vendorQuestionResponse} from '@prisma/client';
import { inject, injectable } from 'inversify';
import { prepareImageData, repositoryError } from '../../utils/utils';
import TYPES from '../../dependencyManager/types';
import {
  AddRoomInfoRepoResponseDto,
  CreateRoomInfoDto,
  CreateRoomInfoResponseDto,
  ImageUploadData,
  QuestionsDto,
  SortCriteriaDTO,
  TypeValidationDetailsDTO,
  VendorRoomListRequestDto,
  VendorRoomListResponseDto,
  RoomDetailsResponseDto,
} from '../dto/vendorRoom.dto';
import { isBase64Image } from '../../utils/isBase64Image';
import { COMMON } from '../../utils/common';
import { randomUUID } from 'crypto';
import RepositoryError from '../../error/repositoryError';
import { S3Service } from '../../libs/s3Service';
import config from 'config';
import { VendorRoomDto } from 'src/vendor/dto/vendor.dto';
import {VENDOR_ROOM_QUESTION_CATEGORY} from '../../utils/constants';

@injectable()
export default class PermissionRepository {
  private readonly prisma: PrismaClient;
  private readonly s3Service: S3Service;
  private readonly s3Url: string;
  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.S3Service) s3Service: S3Service
  ) {
    this.prisma = prisma;
    this.s3Service = s3Service;
    this.s3Url = config.get<string>('aws.s3Url');
  }

  async findRoomById(id: number): Promise<vendorRoom | null> {
    return this.prisma.vendorRoom.findUnique({ where: { id } });
  }

  private buildSortCriteria(sortBy: any): {
    field: string;
    order: Prisma.SortOrder;
  } {
    return sortBy
      ? {
          field: sortBy.field,
          order:
            sortBy.order.toLowerCase() === 'asc'
              ? Prisma.SortOrder.asc
              : Prisma.SortOrder.desc,
        }
      : { field: 'id', order: 'asc' };
  }

  async getVendorRoomList(data: VendorRoomListRequestDto) {
    try {
      const { searchText, sortBy, offset, limit, startDate, endDate } = data;

      const whereClause: Prisma.vendorRoomWhereInput = {};

      const pageSize: number = limit || 20;

      const sortCriteria: SortCriteriaDTO = this.buildSortCriteria(sortBy);
      if (startDate) {
        whereClause.createdAt = {
          gte: new Date(startDate),
        };
      }
      if (endDate) {
        whereClause.createdAt = {
          lte: new Date(endDate),
        };
      }
      if (searchText) {
        whereClause.OR = [{ roomName: { contains: searchText } }];

        const numericSearch: number = parseFloat(searchText);
        if (!isNaN(numericSearch)) {
          whereClause.OR.push(
            { maxCapacity: numericSearch },
            { rentalFee: numericSearch }
          );
        }
      }

      const orderBy: { [x: string]: Prisma.SortOrder } = {
        [sortCriteria.field]: sortCriteria.order,
      };

      const vendorRoomList: VendorRoomListResponseDto[] =
        await this.prisma.vendorRoom.findMany({
          where: whereClause,
          orderBy,
          skip: offset,
          take: limit,
        });
      const vendorListCount: number = await this.prisma.vendorRoom.count({
        where: whereClause,
      });
      const totalPages: number = Math.ceil(vendorListCount / pageSize);
      const nextPage: boolean = offset + pageSize < vendorListCount;

      return {
        vendorRoomList,
        totalAmount: vendorListCount,
        totalPages,
        nextPage,
      };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findVendorById(id: number) {
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { id },
      select: { id: true },
    });
    return existingVendor ? existingVendor?.id : null;
  }

  async findQuestionById(questionId: number) {
    return await this.prisma.question.findUnique({
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
    questionId: number
  ): Promise<TypeValidationDetailsDTO | null> {
    try {
      return await this.prisma.questionValidation.findMany({
        where: { questionId: questionId },
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

  private async processImagesAndUpdateQuestions(data): Promise<any[]> {
    const processQuestion = async (item:QuestionsDto) => {
      const question:QuestionsDto = { ...item };
      if (question?.customValue && isBase64Image(question?.customValue)) {
        const imageData: ImageUploadData = {
          photo: question.customValue,
          name: `${COMMON.VENDOR_ROOM_INFO}-${randomUUID()}`,
        };
        const basePath: string = COMMON.VENDOR_IMGAGE_PATH;
        const { key, imageBuffer, contentType } = prepareImageData(
          imageData.photo,
          imageData.name,
          basePath
        );

        await this.s3Service.uploadImage({
          key,
          body: imageBuffer,
          contentType,
        });
        question.fileURL = `${this.s3Url}/${key}`
        question.customValue = '';
      }
      return question;
    };

    return Promise.all(data?.questions.map(processQuestion));
  }

  async addRoomInfoAndQuestionnair(
    data: CreateRoomInfoDto
  ): Promise<AddRoomInfoRepoResponseDto> {
    try {
      const {
        vendorId,
        roomName,
        rentalFee,
        maxCapacity,
        createdBy,
        updatedBy,
      }:CreateRoomInfoDto = data;

      return await this.prisma.$transaction(async (prisma) => {
        const roomInfo: CreateRoomInfoResponseDto =
          await prisma.vendorRoom.create({
            data: {
              vendorId,
              roomName,
              rentalFee,
              maxCapacity,
              createdBy,
              updatedBy,
            },
          });

        const roomId: number = roomInfo.id;

        const questions:QuestionsDto[] = await this.processImagesAndUpdateQuestions(data);

        const questionsInserted: Prisma.BatchPayload =
          await prisma.vendorQuestionResponse.createMany({
            data: questions?.flatMap((item) => {
              if (
                !item.questionOptionId ||
                item.questionOptionId.length === 0
              ) {
                if (item?.fileURL) {
                  return [
                    {
                      vendorId: data.vendorId,
                      vendorRoomId: roomId,
                      questionId: item.questionId,
                      fileURL: item.fileURL ?? null,
                      customValue: null,
                      createdBy: data.createdBy,
                      updatedBy: data.updatedBy,
                    },
                  ];
                } else {
                  return [
                    {
                      vendorId: data.vendorId,
                      vendorRoomId: roomId,
                      questionId: item.questionId,
                      customValue: item.customValue ?? null,
                      createdBy: data.createdBy,
                      updatedBy: data.updatedBy,
                    },
                  ];
                }
              }
              return item.questionOptionId.map((optionId: number) => ({
                vendorId: data.vendorId,
                vendorRoomId: roomId,
                questionId: item.questionId,
                questionOptionId: optionId,
                customValue: null,
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
              }));
            }),
          });

        return { roomInfo, questionsInserted };
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`
      );
    }
  }

  async roomListData(): Promise<VendorRoomDto[]> {
    try {
      const vendorRooms = await this.prisma.vendorRoom.findMany({
        select: {
          id: true,
          vendorId: true,
          roomName: true,
          maxCapacity: true,
          rentalFee: true,
          createdBy: true,
          createdAt: true,
          updatedBy: true,
          updatedAt: true,
        },
      });
        return vendorRooms;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

    async getRoomDetailsById(id: number): Promise<RoomDetailsResponseDto | null> {
    try {
      const room = await this.prisma.vendorRoom.findUnique({
        where: { id },
        include: {
          vendor: {
            include: {
              vendorQuestionResponse: {
                include: {
                  question: {
                    include: {
                      questionCategory: true,
                      questionOptions: true,
                      questionValidation: {
                        include : {
                          typeValidation: true
                        }
                      }
                    },
                  },
                  questionOption: true,
                },
              },
            },
          },
        },
      });
    
      let filteredQuestionResponses;
      if (!room) {
         return null;
      }
       else {
          filteredQuestionResponses = room.vendor.vendorQuestionResponse.filter(
          (questionResponse) =>
            (questionResponse.vendorRoomId == id) &&
            questionResponse.question.questionCategoryId === VENDOR_ROOM_QUESTION_CATEGORY
        );
      }

      const roomDetails: RoomDetailsResponseDto = {
      id: room.id,
      vendorId: room.vendor.id,
      roomName: room.roomName,
      rentalFee: room.rentalFee,
      maxCapacity: room.maxCapacity,
      questionResponse: filteredQuestionResponses.map(questionResponse => ({
        question: {
          id: questionResponse.question.id,
          Question: questionResponse.question.question,
        },
      questionValidation: Array.isArray(questionResponse.question.questionValidation)
        ? questionResponse.question.questionValidation.map(validation => ({
            id: validation.id,
            questionId: validation.questionId,
            typeValidationId: validation.typeValidationId,
            typeValidation: {
              id: validation.typeValidation.id,
              typeField: validation.typeValidation.typeField,
              typeValue: validation.typeValidation.typeValue,
            },
          }))
        : [],
        questionOption: questionResponse.questionOption ? {
          id: questionResponse.questionOption.id || null,
          option: questionResponse.questionOption.option || null,
        } : undefined,
        CustomValue: questionResponse.customValue || '',
        FileUrl: questionResponse.fileURL || null,
  })),
};

  return roomDetails;

      
    } catch (err: unknown) {
      repositoryError(err);
    }
  }


}
