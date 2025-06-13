import { inject, injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import LookupDataService from '../services/lookupDataService';
import {
  LookupResponseData,
  QuestionList,
  ShortQuestionCategoryListDataToDbDto,
  ShortQuestionCategoryListDataResponseDto,
} from '../dto/lookupData.dto';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class LookupDataController {
  constructor(
    @inject(TYPES.LookupDataService)
    private readonly lookupDataService: LookupDataService,
  ) {}

  async getDegreeList(_: CustomRequest, res: Response, next: NextFunction) {
    try {
      const DegreeList: LookupResponseData[] =
        await this.lookupDataService.getDegreeList();
      res.status(HttpStatusCode.Created).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: DegreeList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSpecialtyList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const specialtyList: LookupResponseData[] =
        await this.lookupDataService.getSpecialtyList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: specialtyList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicalLicenseStateList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const medicalLicenseStateList: LookupResponseData[] =
        await this.lookupDataService.getMedicalLicenseStateList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: medicalLicenseStateList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicalLicenseJurisdictionsList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const medicalLicenseJurisdictionsList =
        await this.lookupDataService.getMedicalLicenseJurisdictionsList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: medicalLicenseJurisdictionsList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSegmentationList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const segmentationList =
        await this.lookupDataService.getSegmentationList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: segmentationList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAffiliationTypeList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const affiliationTypeList =
        await this.lookupDataService.getAffiliationTypeList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: affiliationTypeList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicalLicenseStatusList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const medicalLicenseStatusList =
        await this.lookupDataService.getMedicalLicenseStatusList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: medicalLicenseStatusList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicalLicenseTypeList(
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const medicalLicenseTypeList =
        await this.lookupDataService.getMedicalLicenseTypeList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: medicalLicenseTypeList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuestionList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const {
        questions,
        totalAmount,
      }: { questions: QuestionList; totalAmount: number } =
        await this.lookupDataService.getQuestionList(
          parseInt(req.params.categoryId, 10),
        );
      res.status(HttpStatusCode.Ok).json({ questions, totalAmount });
    } catch (error) {
      next(error);
    }
  }

  async getShortQuestionCategoryList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ShortQuestionCategoryListDataToDbDto = req.body;
      const QuestionCategoryList: ShortQuestionCategoryListDataResponseDto =
        await this.lookupDataService.getShortQuestionCategoryList(data);
      res.status(HttpStatusCode.Ok).json({
        QuestionCategoryList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWorkItemsList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workItemsList =
        await this.lookupDataService.getWorkItemsList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.FETCHED_DATA_SUCCESSFULLY,
        data: workItemsList,
      });
    } catch (error) {
      next(error);
    }
  }
}
