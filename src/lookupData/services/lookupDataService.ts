import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import LookupDataRepository from '../repositories/lookupDataRepository';
import { NotFoundError } from '../../error/notFoundError';
import { MESSAGES } from '../../utils/message';
import {
  QuestionList,
  ShortQuestionCategoryListDataToDbDto,
} from '../dto/lookupData.dto';
@injectable()
export default class LookupDataService {
  private readonly lookupDataRepository: LookupDataRepository;

  constructor(
    @inject(TYPES.LookupDataRepository)
    lookupDataRepository: LookupDataRepository,
  ) {
    this.lookupDataRepository = lookupDataRepository;
  }

  async getDegreeList() {
    return this.lookupDataRepository.getDegreeList();
  }

  async getSpecialtyList() {
    return this.lookupDataRepository.getSpecialtyList();
  }

  async getMedicalLicenseStateList() {
    return this.lookupDataRepository.getMedicalLicenseStateList();
  }

  async getMedicalLicenseTypeList() {
    return this.lookupDataRepository.getMedicalLicenseTypeList();
  }

  async getMedicalLicenseJurisdictionsList() {
    return this.lookupDataRepository.getMedicalLicenseJurisdictionsList();
  }

  async getSegmentationList() {
    return this.lookupDataRepository.getSegmentationList();
  }

  async getAffiliationTypeList() {
    return this.lookupDataRepository.getAffiliationTypeList();
  }

  async getMedicalLicenseStatusList() {
    return this.lookupDataRepository.getMedicalLicenseStatusList();
  }

  async getQuestionList(questionCategoryId: number) {
    try {
      const {
        questions,
        totalAmount,
      }: { questions: QuestionList; totalAmount: number } =
        await this.lookupDataRepository.getQuestionList(questionCategoryId);

      if (totalAmount === 0)
        throw new NotFoundError(
          MESSAGES.NO_QUESTIONS_EXIST(questionCategoryId),
        );

      return {
        questions,
        totalAmount,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getShortQuestionCategoryList(
    data: ShortQuestionCategoryListDataToDbDto,
  ) {
    return this.lookupDataRepository.getShortQuestionCategoryList(data);
  }

  async getWorkItemsList() {
    return this.lookupDataRepository.getWorkItemsList();
  }
}
