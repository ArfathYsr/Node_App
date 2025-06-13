import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import {
  CreateTherapeuticAreaDataToDbDto,
  EditTherapeuticAreaDto,
  TherapeuticArea,
} from '../dto/therapeuticArea.dto';
import TYPES from '../../dependencyManager/types';
import { NotFoundError } from '../../error/notFoundError';
import RepositoryError from '../../error/repositoryError';

@injectable()
class TherapeuticAreaRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByName(name: string) {
    const findtherapeuticArea = await this.prisma.therapeuticArea.findFirst({
      where: {
        name,
      },
    });
    return findtherapeuticArea;
  }

  async findById(Id: number) {
    return this.prisma.therapeuticArea.findUnique({
      where: {
        id: Id,
      },
    });
  }

  async createTherapeuticArea({
    createdBy,
    updatedBy,
    ...therapeuticAreaData
  }: CreateTherapeuticAreaDataToDbDto) {
    try {
      const newTherapeuticArea = await this.prisma.therapeuticArea.create({
        data: {
          name: therapeuticAreaData.name,
          startDate: therapeuticAreaData.startDate,
          endDate: therapeuticAreaData.endDate,
          description: therapeuticAreaData.description,
          isActive: therapeuticAreaData.isActive,
          createdBy,
          updatedBy,
        },
      });

      return newTherapeuticArea;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  } // not need

  async listTherapeuticArea() {
    try {
      const listTherapeuticArea = await this.prisma.therapeuticArea.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          startDate: true,
          endDate: true,
        },
      });
      return listTherapeuticArea;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async therapeuticAreaById(therapeuticAreaId: number) {
    try {
      const therapeuticAreas = await this.prisma.therapeuticArea.findUnique({
        where: { id: therapeuticAreaId },
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          isActive: true,
        },
      });

      if (!therapeuticAreas) {
        throw new NotFoundError(
          `Therapeutic Area with clientId ${therapeuticAreaId} not found.`,
        );
      }

      return therapeuticAreas;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getExistingtherapeuticAreaIds(therapeuticAreaIds) {
    try {
      const existingtherapeuticArea: TherapeuticArea[] =
        await this.prisma.therapeuticArea.findMany({
          where: { id: { in: therapeuticAreaIds } },
          select: { id: true },
        });
      return existingtherapeuticArea;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async edittherapeuticArea(
    therapeuticAreaId: number,
    therapeuticAreaEditData: EditTherapeuticAreaDto,
  ) {
    try {
      const edittherapeuticArea = await this.prisma.therapeuticArea.update({
        where: {
          id: therapeuticAreaId,
        },
        data: {
          name: therapeuticAreaEditData.name,
          startDate: therapeuticAreaEditData.startDate,
          endDate: therapeuticAreaEditData.endDate,
          description: therapeuticAreaEditData.description,
          isActive: therapeuticAreaEditData.isActive,
          updatedBy: therapeuticAreaEditData.updatedBy,
        },
      });
      return edittherapeuticArea;
    } catch (error) {
      throw new RepositoryError(`Repository Error: Unknown error`);
    }
  }

  async deletetherapeuticArea(therapeuticAreaIds: number[]) {
    try {
      await this.prisma.therapeuticArea.deleteMany({
        where: { id: { in: therapeuticAreaIds } },
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
}

export default TherapeuticAreaRepository;
