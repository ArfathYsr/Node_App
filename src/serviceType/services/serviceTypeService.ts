import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import ServiceTypeRepository from '../repositories/serviceTypeRepository';
import {
  AddServiceTypeInfoResponseDTO,
  AddServiceTypesRequestDTO,
  EditServiceTypeInfoResponseDTO,
  EditServiceTypesRequestDTO,
  ExistingServiceTypeNameDTO,
  ServiceTypeDTO,
  ServiceTypeListRequestDto,
  ServiceTypeListShortRequestDto,
  ViewServiceTypeResponseDTO,
} from '../dto/serviceType.dto';
import { ValidationError } from '../../error/validationError';
import { SERVICE_TYPES_MESSAGES } from '../../utils/Messages/serviceType';
import { checkIds } from '../../utils/validateIds';
import { EntityTags } from '../../utils/constants';
import { COMMON } from '../../utils/common';
import { MESSAGES } from '../../utils/message';
import { NotFoundError } from '../../error/notFoundError';

@injectable()
export default class serviceTypeService {
  constructor(
    @inject(TYPES.ServiceTypeRepository)
    private readonly serviceTypeRepository: ServiceTypeRepository,
  ) {}

  async serviceTypeList(data: ServiceTypeListRequestDto) {
    return this.serviceTypeRepository.serviceTypeList(data);
  }

  async serviceTypeListShort(data: ServiceTypeListShortRequestDto) {
    return this.serviceTypeRepository.serviceTypeListShort(data);
  }
  async addServiceTypes(
    data: AddServiceTypesRequestDTO,
  ): Promise<AddServiceTypeInfoResponseDTO> {
    try {
      const { serviceOfferingIds, workItemIds, name, type, cloneId } = data;

      if (type === COMMON.CLONE && !cloneId) {
        throw new Error(MESSAGES.CLONE_ID_REQUIRED);
      }
      if (cloneId && type === COMMON.CLONE) {
        const validCloneData: { id: number } | null | undefined =
          await this.serviceTypeRepository.findValidCloneId(cloneId);
        if (!validCloneData) {
          throw new Error(MESSAGES.INVALID_CLONED_ID(cloneId));
        }
      }
      //validate service offering Id's
      if (serviceOfferingIds) {
        await this.validateServiceOfferingIds(serviceOfferingIds);
      }

      //validate work item Id's
      if (workItemIds) {
        await this.validateWorkItemIds(workItemIds);
      }

      //validate Service Type Name
      const checkExistingServiceTypeName: ExistingServiceTypeNameDTO =
        await this.serviceTypeRepository.checkExistingServiceTypeName(name);
      if (checkExistingServiceTypeName) {
        throw new ValidationError(SERVICE_TYPES_MESSAGES.DUPLICATE_NAME);
      }
      return this.serviceTypeRepository.addServiceType(data);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async validateServiceOfferingIds(
    serviceOfferingIds: number[],
  ): Promise<void> {
    await checkIds(
      serviceOfferingIds,
      this.serviceTypeRepository.getExistingServiceOfferingIds.bind(
        this.serviceTypeRepository,
      ),
      EntityTags.SERVICE_OFFERING,
    );
  }

  private async validateWorkItemIds(workItemIds: number[]): Promise<void> {
    await checkIds(
      workItemIds,
      this.serviceTypeRepository.getExistingWorkItemIds.bind(
        this.serviceTypeRepository,
      ),
      EntityTags.WORK_ITEM,
    );
  }

  async editServiceTypes(
    data: EditServiceTypesRequestDTO,
  ): Promise<EditServiceTypeInfoResponseDTO> {
    try {
      const {
        serviceTypeId,
        serviceOfferingIds = [],
        name,
        workItemIds = [],
      }: EditServiceTypesRequestDTO = data;

      const checkExistingServiceTypeName: ExistingServiceTypeNameDTO =
        await this.serviceTypeRepository.checkExistingServiceTypeNameWithExclusion(
          name,
          serviceTypeId,
        );
      if (checkExistingServiceTypeName) {
        throw new ValidationError(SERVICE_TYPES_MESSAGES.DUPLICATE_NAME);
      }
      if (serviceOfferingIds.length > 0) {
        await this.validateServiceOfferingIds(serviceOfferingIds);
      }
      if(workItemIds?.length > 0){
        await this.validateWorkItemIds(workItemIds)
      }
      return this.serviceTypeRepository.editServiceType(data);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  async viewServiceType(
    serviceTypeId: number,
  ): Promise<ViewServiceTypeResponseDTO> {
    try {
      const serviceTypeInfo: ServiceTypeDTO | null =
        await this.serviceTypeRepository.viewServiceType(serviceTypeId);
      if (!serviceTypeInfo) {
        throw new NotFoundError(SERVICE_TYPES_MESSAGES.SERVICE_TYPE_NOT_FOUND);
      }
      const reformattedServiceTypeInfo: ViewServiceTypeResponseDTO = {
        id: serviceTypeInfo?.id,
        name: serviceTypeInfo?.name,
        description: serviceTypeInfo?.description,
        isActive: serviceTypeInfo?.isActive,
        archivedAt: serviceTypeInfo?.archivedAt,
        createdBy: serviceTypeInfo?.createdBy,
        createdAt: serviceTypeInfo?.createdAt,
        updatedBy: serviceTypeInfo?.updatedBy,
        updatedAt: serviceTypeInfo?.updatedAt,
        serviceOfferings: serviceTypeInfo?.serviceTypeOffering.map(
          (offering) => ({
            id: offering.serviceOffering.id,
            name: offering.serviceOffering.name,
            description: offering.serviceOffering.description,
            isActive: offering.serviceOffering.isActive,
          }),
        ),
        workItems: serviceTypeInfo?.serviceTypeWorkItem.map((workItem) => ({
          id: workItem.workItem.id,
          name: workItem.workItem.name,
          actionType: workItem.workItem.workItemActionType.name,
          status: workItem.workItem.workItemStatus.name,
        })),
        createdByProfile: {
            firstName: serviceTypeInfo.createdByProfile.firstName,
            lastName: serviceTypeInfo.createdByProfile.lastName,
        },
        updatedByProfile: {
          firstName: serviceTypeInfo.updatedByProfile.firstName,
          lastName: serviceTypeInfo.updatedByProfile.lastName,
        }
      };
      return reformattedServiceTypeInfo;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  async archiveServiceType(serviceTypeId: number): Promise<{
    message: string;
  }> {
    try {
      const getExistingServiceType: ServiceTypeDTO | null =
        await this.serviceTypeRepository.viewServiceType(serviceTypeId);
      if (!getExistingServiceType) {
        throw new NotFoundError(
          SERVICE_TYPES_MESSAGES.INVALID_SERVICE_TYPE_ID(serviceTypeId),
        );
      }
      if (getExistingServiceType.archivedAt !== null) {
        throw new ValidationError(
          SERVICE_TYPES_MESSAGES.ARCHIVE_ERROR(serviceTypeId),
        );
      }
      await this.serviceTypeRepository.archiveServiceType(serviceTypeId);
      return {
        message: SERVICE_TYPES_MESSAGES.ARCHIVED_SUCCESS(serviceTypeId),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  async unArchiveServiceType(serviceTypeId: number): Promise<{
    message: string;
  }> 
  {
    try {
      const getExistingServiceType: ServiceTypeDTO | null =
        await this.serviceTypeRepository.viewServiceType(serviceTypeId);
      if (!getExistingServiceType) {
        throw new NotFoundError(
          SERVICE_TYPES_MESSAGES.INVALID_SERVICE_TYPE_ID(serviceTypeId),
        );
      }
      if (getExistingServiceType.archivedAt === null) {
        throw new ValidationError(
          SERVICE_TYPES_MESSAGES.UNARCHIVE_ERROR(serviceTypeId),
        );
      }
      await this.serviceTypeRepository.unArchiveServiceType(serviceTypeId);
      return {
        message: SERVICE_TYPES_MESSAGES.UNARCHIVE_SUCCESS(serviceTypeId),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}
