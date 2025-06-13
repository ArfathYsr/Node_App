import { inject, injectable } from 'inversify';
import config from 'config';
import {
  CreateTherapeuticAreaDto,
  ViewTherapeuticAreaByIdDataResponseDto,
  EditTherapeuticAreaDto,
  EditTherapeuticAreaResponseDto,
  TherapeuticArea,
} from '../dto/therapeuticArea.dto';
import TYPES from '../../dependencyManager/types';
import DateService from '../../libs/dateService';
import { ValidationError } from '../../error/validationError';
import { NotFoundError } from '../../error/notFoundError';
import TherapeuticAreaRepository from '../repositories/therapeuticAreaRepository';

@injectable()
export default class TherapeuticAreaService {
  private readonly therapeuticAreaRepository: TherapeuticAreaRepository;

  private readonly dateService: DateService;

  constructor(
    @inject(TYPES.TherapeuticAreaRepository)
    therapeuticAreaRepository: TherapeuticAreaRepository,
    @inject(TYPES.DateService) dateService: DateService,
  ) {
    this.therapeuticAreaRepository = therapeuticAreaRepository;
    this.dateService = dateService;
  }

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>('defaultEntity.defaultEndDate'));
  }

  async createTherapeuticArea<T extends CreateTherapeuticAreaDto>(data: T) {
    try {
      const { createdBy, updatedBy } = data;

      const existingTherapeuticArea =
        await this.therapeuticAreaRepository.findByName(data.name);
      if (existingTherapeuticArea) {
        throw new ValidationError(
          `A therapeutic area with the name "${data.name}" already exists.`,
        );
      }

      if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
        throw new ValidationError(
          'End date cannot be earlier than start date.',
        );
      }

      const endDateDefault: Date = this.getDefaultEndDate();

      const newData: CreateTherapeuticAreaDto = {
        ...data,
        createdBy,
        updatedBy,
        endDate: data.endDate || endDateDefault,
      };

      const therapeuticArea =
        await this.therapeuticAreaRepository.createTherapeuticArea(newData);

      return { id: therapeuticArea.id };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listTherapeuticArea() {
    return this.therapeuticAreaRepository.listTherapeuticArea();
  }

  async gettherapeuticAreaById(therapeuticAreaId: number) {
    try {
      const gettherapeuticArea: ViewTherapeuticAreaByIdDataResponseDto =
        await this.therapeuticAreaRepository.therapeuticAreaById(
          therapeuticAreaId,
        );
      return gettherapeuticArea;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editTherapeuticArea(
    therapeuticAreaId: number,
    data: EditTherapeuticAreaDto,
  ) {
    try {
      const getTherapeuticAreaData =
        await this.therapeuticAreaRepository.therapeuticAreaById(
          therapeuticAreaId,
        );

      if (!getTherapeuticAreaData) {
        throw new NotFoundError(
          `Therapeutic area with id ${therapeuticAreaId} not found.`,
        );
      }
      const existingTherapeuticArea =
        await this.therapeuticAreaRepository.findByName(data.name);
      if (existingTherapeuticArea) {
        throw new ValidationError(
          `A therapeutic area with the name "${data.name}" already exists.`,
        );
      }

      const endDateDefault: Date = this.getDefaultEndDate();

      const updatedData: EditTherapeuticAreaDto = {
        ...data,
        endDate: data.startDate
          ? data.endDate || endDateDefault.toISOString()
          : undefined,
      };

      const therapeuticAreaData: EditTherapeuticAreaResponseDto =
        await this.therapeuticAreaRepository.edittherapeuticArea(
          therapeuticAreaId,
          updatedData,
        );
      return { id: therapeuticAreaData.id };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deleteTherapeuticArea(TherapeuticAreaIds: number[]): Promise<void> {
    try {
      const existingTherapeuticArea: TherapeuticArea[] =
        await this.therapeuticAreaRepository.getExistingtherapeuticAreaIds(
          TherapeuticAreaIds,
        );
      const existingIds: number[] = existingTherapeuticArea.map(
        (perm) => perm.id,
      );
      const missingIds: number[] = TherapeuticAreaIds.filter(
        (id) => !existingIds.includes(id),
      );
      if (missingIds.length > 0) {
        throw new NotFoundError(
          `TherapeuticArea Ids not found: ${missingIds.join(', ')}`,
        );
      }
      await this.therapeuticAreaRepository.deletetherapeuticArea(
        TherapeuticAreaIds,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}
