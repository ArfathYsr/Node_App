import { inject, injectable } from 'inversify';
import config from 'config';
import { HttpStatusCode } from 'axios';
import OrgHierarchyRepository from '../repositories/orgHierarchyRepository';
import TYPES from '../../dependencyManager/types';
import { AddHierarchyReqData, ListOrgHierarchyBodyDto } from '../dto/orgHierarchy.dto';

@injectable()
export default class OrgHierarchyService {
  constructor(
    @inject(TYPES.OrgHierarchyRepository)
    private readonly orgHierarchyRepository: OrgHierarchyRepository,
  ) { }
  async listOrgHierarchy(data: ListOrgHierarchyBodyDto) {
    return await this.orgHierarchyRepository.listOrgHierarchy(data);
  }
  async cloneOrgHierarchy(data: AddHierarchyReqData) {
    return await this.orgHierarchyRepository.cloneClientOrgHierarchy(data);
  }
}