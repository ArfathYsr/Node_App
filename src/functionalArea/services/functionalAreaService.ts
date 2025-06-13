import { inject, injectable } from 'inversify';
import config from 'config';
import { ClientIdDto } from '../../client/dto/client.dto';
import { BadRequestError } from '../../error/badRequestError';
import { MESSAGES } from '../../utils/message';
import ClientRepository from '../../client/repositories/clientRepository';
import HistoryService from '../../utils/historyService';
import TYPES from '../../dependencyManager/types';
import FunctionalAreaRepository from '../repositories/functionalAreaRepository';
import {
  CreateFunctionalAreaDto,
  CreateFunctionalAreaDataToDbDto,
  FunctionalAreaDataDto,
  FunctionalAreaListDataToDbDto,
  FunctionalAreaListDataResponseDto,
  EditFunctionalAreaDto,
  FunctionalArea,
  FunctionalAreaRoleListDataToDbDto,
  FunctionalAreaArchiveDto,
  ViewShortFunctionalAreasDto,
  ShortFunctionalAreasDto,
  ShortFunctionalAreaDto,
} from '../dto/functionalArea.dto';
import { NotFoundError } from '../../error/notFoundError';
import DateService from '../../libs/dateService';
import { COMMON } from '../../utils/common';

@injectable()
export default class FunctionalAreaService {
  private readonly functionalAreaRepository: FunctionalAreaRepository;

  private readonly clientRepository: ClientRepository;

  private readonly dateService: DateService;

  private readonly historyService: HistoryService;

  constructor(
    @inject(TYPES.FunctionalAreaRepository)
    functionalAreaRepository: FunctionalAreaRepository,
    @inject(TYPES.ClientRepository)
    clientRepository: ClientRepository,
    @inject(TYPES.DateService) dateService: DateService,
    @inject(TYPES.HistoryService) historyService: HistoryService,
  ) {
    this.functionalAreaRepository = functionalAreaRepository;
    this.dateService = dateService;
    this.historyService = historyService;
    this.clientRepository = clientRepository;
  }

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>(COMMON.DEFAULT_ENTITY_AND_DATE));
  }

  async createFunctionalArea(data: CreateFunctionalAreaDto) {
    const defaultEndDate: Date = this.getDefaultEndDate();

    const { createdBy, updatedBy, clientIds, cloneId, type } = data;
    const checkAlreadyExisting: { id: number } | null =
      await this.functionalAreaRepository.findFunctionalAreaByName(data.name);
    if (checkAlreadyExisting) {
      throw new BadRequestError(
        MESSAGES.FUNCTIONAL_AREA_NAME_ALREADY_EXISTS(data.name),
      );
    }
    if (cloneId) {
      const validCloneData: { id: number } | null =
        await this.functionalAreaRepository.findValidFunctionalArea(cloneId);
      if (!validCloneData) {
        throw new BadRequestError(MESSAGES.INVALID_CLONED_ID(cloneId));
      }
    }
    if (clientIds?.length) {
      const existingClientIds: ClientIdDto[] =
        await this.clientRepository.getExistingClientIds(clientIds);
      const existingIds: number[] = existingClientIds.map(
        (client) => client.id,
      );
      const missingIds: number[] = clientIds.filter(
        (id) => !existingIds.includes(id),
      );
      if (missingIds.length > 0) {
        throw new BadRequestError(MESSAGES.INVALID_CLIENTS_IDS(missingIds));
      }
    }

    if (type === COMMON.CLONE && !cloneId) {
      throw new Error(MESSAGES.CLONE_ID_REQUIRED);
    }

    const newData: CreateFunctionalAreaDataToDbDto = {
      name: data.name,
      description: data.description,
      createdBy,
      updatedBy,
      isExternal: data.isExternal,
      startDate: data.startDate,
      endDate: data?.endDate || defaultEndDate,
      clientIds,
      cloneId,
    };
    const functionalArea =
      await this.functionalAreaRepository.createFunctionalArea(newData);

    await this.historyService.trackFieldChanges(
      'functionalArea',
      0,
      functionalArea,
      createdBy,
    );
    return {
      functionalArea: { id: functionalArea.id },
    };
  }

  async getFunctionalArea(functionalAreaId: number) {
    try {
      const getFunctionalAreaData: FunctionalAreaDataDto | any =
        await this.functionalAreaRepository.getFunctionalAreaById(
          functionalAreaId,
        );
      if (!getFunctionalAreaData) {
        throw new NotFoundError(
          MESSAGES.FUNCTIONAL_AREA_ID_NOT_FOUND(functionalAreaId),
        );
      }
      return getFunctionalAreaData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getFunctionalAreaList(data: FunctionalAreaListDataToDbDto) {
    try {

      const result = await this.functionalAreaRepository.getFunctionalAreaList(data);

      const functionalAreasResponse: FunctionalAreaListDataResponseDto =
        result || {
          functionalAreas: [],
          totalAmount: 0,
        };

      return {
        functionalAreas: functionalAreasResponse.functionalAreas,
        totalAmount: functionalAreasResponse.totalAmount,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editFunctionalArea(
    functionalAreaId: number,
    data: EditFunctionalAreaDto,
  ) {
    try {
      const checkAlreadyExisting: { id: number } | null =
        await this.functionalAreaRepository.findFunctionalAreaByName(
          data.name,
          functionalAreaId,
        );
      if (checkAlreadyExisting) {
        throw new BadRequestError(
          MESSAGES.FUNCTIONAL_AREA_NAME_ALREADY_EXISTS(data.name),
        );
      }
      const getFunctionalAreaData =
        await this.functionalAreaRepository.getFunctionalAreaById(
          functionalAreaId,
        );
      if (
        data.endDate &&
        data.startDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        throw new BadRequestError(MESSAGES.INVALID_START_END_DATE);
      }

      if (data.clientIds && data.clientIds.length === 0) {
        throw new Error(MESSAGES.CLIENT_ID_REQUIRED);
      }

      if (!getFunctionalAreaData) {
        throw new NotFoundError(
          MESSAGES.FUNCTIONAL_AREA_ID_NOT_FOUND(functionalAreaId),
        );
      }

      if (data.clientIds && data.clientIds.length > 0) {
        const existingClients =
          await this.functionalAreaRepository.getExistingClientIds(
            data.clientIds,
          );
        const existingIds: number[] = existingClients.map(
          (client) => client.id,
        );
        const missingIds: number[] = data.clientIds.filter(
          (id) => !existingIds.includes(id),
        );
        if (missingIds.length > 0) {
          throw new BadRequestError(MESSAGES.INVALID_CLIENTS_IDS(missingIds));
        }
        const inactiveClients =
          await this.functionalAreaRepository.findInactiveClients(
            data.clientIds,
          );

        const inactiveClientIds: number[] = inactiveClients.map(
          (client) => client.id,
        );
        if (inactiveClientIds.length > 0) {
          throw new Error(
            MESSAGES.INACTIVE_CLIENTS_OR_DO_NOT_EXISTS(inactiveClientIds),
          );
        }
      }

      const { updatedBy } = data;
      const defaultEndDate = this.getDefaultEndDate();
      const updatedData: EditFunctionalAreaDto = {
        ...data,
        updatedBy,
        endDate:
          data?.endDate || getFunctionalAreaData.endDate || defaultEndDate,
      };
      await this.historyService.trackFieldChanges(
        'functionalArea',
        functionalAreaId,
        data,
        data.updatedBy,
      );
      await this.functionalAreaRepository.editFunctionalArea(
        functionalAreaId,
        updatedData,
      );

      return {
        functionalArea: {
          id: functionalAreaId,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deleteFunctionalAreas(functionalAreaIds: number[]): Promise<void> {
    const existingFunctionalAreas: FunctionalArea[] =
      await this.functionalAreaRepository.getExistingFunctionalAreaIds(
        functionalAreaIds,
      );
    const existingIds: number[] = existingFunctionalAreas.map((fa) => fa.id);
    const missingIds: number[] = functionalAreaIds.filter(
      (id) => !existingIds.includes(id),
    );
    if (missingIds.length > 0) {
      throw new NotFoundError(
        MESSAGES.FUNCTIONAL_AREA_IDS_NOTFOUND(missingIds),
      );
    }
    await this.functionalAreaRepository.deleteFunctionalAreas(
      functionalAreaIds,
    );
  }

  async getFunctionalAreaRoleList(data: FunctionalAreaRoleListDataToDbDto) {
    return this.functionalAreaRepository.getFunctionalAreaRoleList(data);
  }

  async archiveFunctionalArea(data: FunctionalAreaArchiveDto) {
    const missingIds =
      await this.functionalAreaRepository.checkFunctionalAreas(data);
    if (missingIds.length !== 0)
      return {
        message: MESSAGES.FUNCTIONAL_AREA_IDS_NOTFOUND(missingIds),
      };
    const checkfunctionalAreasDeactivated =
      await this.functionalAreaRepository.checkfunctionalAreasDeactivated(data);
    if (checkfunctionalAreasDeactivated.length !== 0)
      return {
        message: MESSAGES.FUNCTIONAL_AREA_ACTIVE_CANT_ARCHIVE(
          checkfunctionalAreasDeactivated,
        ),
      };
    await this.functionalAreaRepository.archiveFunctionalArea(data);
    return { message: MESSAGES.FUNCTIONAL_AREA_ARCHIVED_SUCCESSFULLY };
  }

  async getShortFunctionalAreas(data: ViewShortFunctionalAreasDto) {
    try {
      const { functionalAreas, totalAmount } =
        await this.functionalAreaRepository.getShortFunctionalAreas(data);

      const updatedAvailableFunctionalAreas: ShortFunctionalAreasDto =
        functionalAreas.map((functionalArea: ShortFunctionalAreaDto) => {
          if (
            !functionalArea ||
            !(functionalArea?.startDate && functionalArea?.endDate)
          ) {
            return functionalArea;
          }
          return {
            ...functionalArea,
          };
        });

      return {
        functionalAreas: updatedAvailableFunctionalAreas,
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
}
