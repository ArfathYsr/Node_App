import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import RepositoryError from '../../error/repositoryError';
import {
  QuestionList,
  QuestionListResponseDto,
  ShortQuestionCategoryListDataToDbDto,
  ShortQuestionCategoryListDataResponseDto,
} from '../dto/lookupData.dto';

@injectable()
class LookupDataRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getDegreeList() {
    return this.prisma.degree.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getSpecialtyList() {
    return this.prisma.specialty.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getMedicalLicenseStateList() {
    return this.prisma.medicalLicenseState.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getMedicalLicenseTypeList() {
    return this.prisma.medicalLicenseType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getMedicalLicenseJurisdictionsList() {
    return this.prisma.medicalLicenseJurisdictions.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getSegmentationList() {
    return this.prisma.segmentation.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getAffiliationTypeList() {
    return this.prisma.affiliationType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getMedicalLicenseStatusList() {
    return this.prisma.medicalLicenseStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getQuestionList(
    questionCategoryId: number,
  ): Promise<QuestionListResponseDto> {
    try {
      const questionList: QuestionList = (await this.prisma.question.findMany({
        orderBy: { displayOrder: 'asc' },
        where: { questionCategoryId },
        select: {
          id: true,
          questionCategoryId: true,
          questionType: {
            select: {
              id: true,
              name: true,
            },
          },
          question: true,
          isActive: true,
          parentQuestionId: true,
          displayOrder: true,
          questionOptions: {
            orderBy: { displayOrder: 'asc' },
            select: {
              id: true,
              questionId: true,
              option: true,
              isActive: true,
              displayOrder: true,
            },
          },
        },
      })) as QuestionList;

      const questionCount: number = await this.prisma.question.count({
        where: { questionCategoryId },
      });

      return {
        questions: questionList,
        totalAmount: questionCount,
      };
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getShortQuestionCategoryList(
    data: ShortQuestionCategoryListDataToDbDto,
  ) {
    try {
      const { searchText }: { searchText?: string } = data;
      const whereClause: Prisma.questionCategoryWhereInput = {};

      if (searchText) {
        whereClause.name = {
          contains: searchText,
        };
      }

      const questionCategoryList: ShortQuestionCategoryListDataResponseDto =
        await this.prisma.questionCategory.findMany({
          orderBy: { id: 'asc' },
          where: whereClause,
          select: {
            id: true,
            name: true,
          },
        });

      return questionCategoryList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getWorkItemsList(){
    try {
      return await this.prisma.workItem.findMany({
        select: {
          id: true,
          name: true,
          workItemActionType: true,
          workItemStatus: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true
        }
      })
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
}

export default LookupDataRepository;
