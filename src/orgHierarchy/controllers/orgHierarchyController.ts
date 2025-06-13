import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { CustomRequest } from '../../types/express';
import OrgHierarchyService from '../services/orgHierarchyService';
import TYPES from '../../dependencyManager/types';
import { AddHierarchyJsonResponse, AddHierarchyReqData, ListOrgHierarchyBodyDto, OrgHierarchyResult } from '../dto/orgHierarchy.dto';
import { ORG_HIERARCHY_MESSAGES } from '../../utils/Messages/orgHierarchyMessages';
@injectable()
export default class OrgHierarchyController {
  constructor(
    @inject(TYPES.OrgHierarchyService)
    private readonly orgHierarchyService: OrgHierarchyService,
  ) { }
  async listOrgHierarchy(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ListOrgHierarchyBodyDto = req.body;
      const { clientHierarchyList, totalAmount }: OrgHierarchyResult = await this.orgHierarchyService.listOrgHierarchy(data);
      res.status(HttpStatusCode.Ok).json({clientHierarchyList, totalAmount})
    } catch (error) {
      next(error)
    }
  }
  async cloneOrgHierarchyData(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;

    try {
      const data: AddHierarchyReqData = req.body;
      const hierarchy :AddHierarchyJsonResponse=
        await this.orgHierarchyService.cloneOrgHierarchy( {
          ...data,
          createdBy,
          updatedBy,
        },
      );

      res.status(HttpStatusCode.Created).json({
        message: ORG_HIERARCHY_MESSAGES.CLIENT_ORG_HIERARCHY_CLONED_SUCCESSFULLY,
        hierarchy,
      });
    } catch (error) {
      next(error);
    }
  }
}