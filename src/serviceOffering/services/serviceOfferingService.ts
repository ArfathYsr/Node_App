import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import serviceOfferingRepository from '../repositories/serviceOfferingRepository';
import {
  CreateServiceOfferingRequest,
  CreateServiceOfferingResponse,
  ServiceTypeWorkItemRequest,
  ServiceTypeWorkItemResponse,
  ServiceOfferingListRequestDto,
  ServiceOfferingResponseDtos,
  EditServiceOfferingRequestDTO,
  ExistingServiceOfferingNameDTO,
  BulkEditServiceOfferingRequestDTO,
  ArchiveOrUnarchiveServiceOfferingDto,
  ListWorkItemRequest,
  ViewServiceOfferingResponseDto,
} from '../dto/serviceOffering.dto';

import { SERVICE_OFFERING_MESSAGES } from '../../utils/Messages/serviceOfferingMessage';
import { StatusMessages } from '../../error/statusCode';
import { COMMON } from '../../utils/common';
import { MESSAGES, SERVICE_OFFERING_ERROR_MESSAGES } from '../../utils/message';
import { BadRequestError } from '../../error/badRequestError';

@injectable()
export default class ServiceOfferingService {
  constructor(
    @inject(TYPES.ServiceOfferingRepository)
    private readonly serviceOfferingRepository: serviceOfferingRepository,
     ) {}

  async createServiceOffering(data: CreateServiceOfferingRequest): Promise<CreateServiceOfferingResponse> {
    try {
      if (data.type === COMMON.CLONE && !data.cloneId) {
        throw new Error(MESSAGES.CLONE_ID_REQUIRED);
      }
      if (data.cloneId && data.type === COMMON.CLONE) {
        const validCloneData: { id: number } | null | undefined =
          await this.serviceOfferingRepository.checkServiceOfferingId(data.cloneId);
        if (!validCloneData) {
          throw new Error(MESSAGES.INVALID_CLONED_ID(data.cloneId));
        }
      }
      if (!data.cloneId ) {
        const existingServiceOffering = await this.serviceOfferingRepository.findServiceOfferingByName(data.name);

        if (existingServiceOffering) {
          throw new Error(SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_ALREADY_EXISTS);
        }
      }

      const createServiceOfferingResponse: CreateServiceOfferingResponse =
        await this.serviceOfferingRepository.createServiceOffering(data);

      return createServiceOfferingResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editServiceOffering(
    serviceOfferingId: number,
    serviceOfferingData: { name: string; description: string; isActive: boolean; serviceOfferingCodeId?: number },
    serviceTypeData: { serviceTypeId: number; workItemIds: number[] }[],
    profileId: number
  ) : Promise<void>{

    if (!Array.isArray(serviceTypeData) || serviceTypeData.length === 0) {
      throw new BadRequestError(
        StatusMessages.AT_LEAST_ONE_SERVICE_TYPE_MUST_BE_SELECTED,
      );
    }

    const hasValidServiceType = serviceTypeData.some(
      (item) =>
        item.serviceTypeId &&
        Array.isArray(item.workItemIds) &&
        item.workItemIds.length > 0,
    );

    if (!hasValidServiceType) {
      throw new BadRequestError(
        StatusMessages.AT_LEAST_ONE_WORK_ITEM_MUST_BE_ENABLED,
      );
    }


    // Extract serviceTypeIds
    const serviceTypeIds = serviceTypeData.map((item) => item.serviceTypeId);

    // Extract all workItemIds (flattened)
    const workItemIds = serviceTypeData.flatMap((item) => item.workItemIds);

    const [
      existingServiceTypeIds,
      existingWorkItemIds,
    ] = await Promise.all([
      this.serviceOfferingRepository.getExistingServiceTypes(),
      this.serviceOfferingRepository.getExistingWorkItems(),
    ]);

    // Convert database result arrays of ids
    const existingServiceTypeArray: number[]= existingServiceTypeIds.map(
      (item) => item.id,
    );

    const existingWorkItemArray: number[]= existingWorkItemIds.map(
      (item) => item.id,
    );

    // Find missing IDs
    const missingServiceTypes: number[] = serviceTypeIds.filter(
      (id) => !existingServiceTypeArray.includes(id),
    );

    if(missingServiceTypes.length){
      throw new BadRequestError(
        StatusMessages.INVALID_SERVICE_TYPES_ID(missingServiceTypes),
      );
    }

    const missingWorkItems: number[] = workItemIds.filter(
      (id) => !existingWorkItemArray.includes(id),
    );

    if(missingWorkItems.length){
      throw new BadRequestError(
        StatusMessages.INVALID_WORK_ITEMS_ID(missingWorkItems),
      );
    }

    // Call repository and retrieve full updated response
    return await this.serviceOfferingRepository.editServiceOffering(
      serviceOfferingId,
      serviceOfferingData,
      serviceTypeData,
      profileId,
    );
  }   

 async serviceOfferingList(
    serviceOfferingListRequestData: ServiceOfferingListRequestDto,
  ): Promise<ServiceOfferingResponseDtos> {
    try {
      return await this.serviceOfferingRepository.getServiceOfferingList(serviceOfferingListRequestData);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

 async listWorkItem(data: ListWorkItemRequest) {
    return this.serviceOfferingRepository.listWorkItem(data);
 }

  async serviceTypeWorkItem(data: ServiceTypeWorkItemRequest): Promise<ServiceTypeWorkItemResponse> {
         return await this.serviceOfferingRepository.serviceTypeWorkItem(data);
  }

  async bulkEditServiceOffering(
    serviceOfferingData: BulkEditServiceOfferingRequestDTO,
    updatedBy: number
  ){
  
    // validating incoming ids 
    const { ids, serviceTypeIds } = serviceOfferingData;

    // Fetch all existing IDs from DB
    const [
      existingServiceOfferingIds,
      existingServiceTypeIds,
    ] = await Promise.all([
      this.serviceOfferingRepository.getExistingServiceOfferings(),
      this.serviceOfferingRepository.getExistingServiceTypes(),
    ]);

    // Convert database result arrays of ids
    const existingServiceOfferingArray: number[]= existingServiceOfferingIds.map(
      (item) => item.id,
    );
    const existingServiceTypeArray: number[]= existingServiceTypeIds.map(
      (item) => item.id,
    );

    // Find missing IDs
    const missingServiceOfferings: number[] = ids.filter(
      (id) => !existingServiceOfferingArray.includes(id),
    );

    const missingServiceTypes: number[] = serviceTypeIds.filter(
      (id) => !existingServiceTypeArray.includes(id),
    );

    if (
      missingServiceOfferings.length ||
      missingServiceTypes.length
    ) {
      throw new BadRequestError(
        SERVICE_OFFERING_ERROR_MESSAGES.INVALID_IDS(
          missingServiceOfferings,
          missingServiceTypes
        ),
      );
    }
    return await this.serviceOfferingRepository.bulkEditServiceOffering(
      serviceOfferingData,
      updatedBy
    );
    
  }   

  async archiveServiceOffering(
    data: ArchiveOrUnarchiveServiceOfferingDto
  ): Promise<{ message: string }> {
    await this.validateServiceOfferingIds(data.serviceOfferingIds);
  
    const alreadyArchivedIds = await this.serviceOfferingRepository.getArchivedServiceOfferingIds(
      data.serviceOfferingIds
    );
  
    if (alreadyArchivedIds.length) {
      return { message: MESSAGES.SERVICE_OFFERING_ALREADY_ARCHIVED(alreadyArchivedIds) };
    }
  
    await this.serviceOfferingRepository.archiveServiceOffering(data);
  
    return { message: MESSAGES.SERVICE_OFFERING_ARCHIVED_SUCCESSFULLY };
  }
  
  async unarchiveServiceOffering(
    data: ArchiveOrUnarchiveServiceOfferingDto
  ): Promise<{ message: string }> {
    await this.validateServiceOfferingIds(data.serviceOfferingIds);
  
    const alreadyUnArchivedIds = await this.serviceOfferingRepository.getUnarchivedServiceOfferingIds(
      data.serviceOfferingIds
    );
  
    if (alreadyUnArchivedIds.length) {
      return { message: MESSAGES.SERVICE_OFFERING_ALREADY_UN_ARCHIVED(alreadyUnArchivedIds) };
    }
  
    await this.serviceOfferingRepository.unarchiveServiceOffering(data);
  
    return { message: MESSAGES.SERVICE_OFFERING_ARCHIVED_SUCCESSFULLY };
  }
  
  async validateServiceOfferingIds(serviceOfferingIds: number[]) {
    const missingIds = await this.serviceOfferingRepository.getMissingServiceOfferingIds(
      serviceOfferingIds
    );
  
    if (missingIds.length) {
      return { message: MESSAGES.SERVICE_OFFERING_NOT_FOUND(missingIds) };
    }
  
    const deactivatedIds = await this.serviceOfferingRepository.getDeactivatedServiceOfferingIds(
      serviceOfferingIds
    );
  
    if (deactivatedIds.length) {
      return { message: MESSAGES.SERVICE_OFFERING_DEACTIVATED(deactivatedIds) };
    }
  }

  async viewServiceOffering( serviceOfferingId: number,
  ) : Promise<ViewServiceOfferingResponseDto>{
    return await this.serviceOfferingRepository.viewServiceOffering(serviceOfferingId);
  }   

}
