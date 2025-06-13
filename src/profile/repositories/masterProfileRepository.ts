import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import {
  ArchiveProfileRequestDto,
  CheckArchiveProfileDto,
  CommunicationPreferencesRequestDto,
  CommunicationPreferencesResponseDto,
  EditAndAddAddressAndEmailRequestDto,
  ExistingAddressesAndEmailForProfileDto,
} from '../dto/profile.dto';
import RepositoryError from '../../error/repositoryError';

@injectable()
class MasterProfileRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAddressIdByProfileId(
    profileId,
  ): Promise<ExistingAddressesAndEmailForProfileDto> {
    try {
      return await this.prisma.profileAddressDetails.findMany({
        where: { profileId },
        select: {
          profileId: true,
          id: true,
          isPrimary: true,
        },
      });
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findEmailAddressIdByProfileId(
    profileId,
  ): Promise<ExistingAddressesAndEmailForProfileDto> {
    try {
      return await this.prisma.profileEmailAddress.findMany({
        where: { profileId },
        select: {
          profileId: true,
          id: true,
          isPrimary: true,
        },
      });
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async editAndAddAddressAndEmail(
    data: EditAndAddAddressAndEmailRequestDto,
  ): Promise<void> {
    try {
      const { addresses, profileId, updatedBy, createdBy } = data;
      await this.prisma.$transaction(async (prisma) => {
        await prisma.profileAddressDetails.deleteMany({
          where: { profileId },
        });
        await prisma.profileAddressDetails.createMany({
          data: addresses.map(({ ...restData }) => ({
            profileId,
            updatedBy,
            createdBy,
            ...restData,
          })),
        });
      });
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findProfileByIdCommunication(
    profileId: number,
  ): Promise<number | null> {
    const result: { id: number } | null =
      await this.prisma.communicationPreferences.findFirst({
        where: {
          profileId,
        },
        select: {
          id: true,
        },
      });

    return result?.id ?? null;
  }

  async UpdateCommunicationPreferences(
    data: CommunicationPreferencesRequestDto,
    profileId: number,
    updatedBy: number,
    communicationPreferenceId: number,
  ): Promise<CommunicationPreferencesResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Update main communication preferences
        const communicationPreferences =
          await prisma.communicationPreferences.update({
            where: { id: communicationPreferenceId },
            data: {
              profileId,
              phoneTypeId: data.phoneTypeId,
              internationalPrefixId: data.internationalPrefix,
              phoneNumber: data.phoneNumber,
              phoneNumberExtension: data.phoneNumberExtension || null,
              faxNumber: data.faxNumber || null,
              updatedBy,
              updatedAt: new Date(),

              callDays: data.bestCallDay?.length
                ? {
                    deleteMany: {},
                    create: data.bestCallDay.map((callDayId) => ({
                      callDay: { connect: { id: callDayId } },
                    })),
                  }
                : { deleteMany: {} },

              callTimes: data.bestCallTime?.length
                ? {
                    deleteMany: {},
                    create: data.bestCallTime.map((callTimeId) => ({
                      callTime: { connect: { id: callTimeId } },
                    })),
                  }
                : { deleteMany: {} },

              emailDays: data.bestEmailDay?.length
                ? {
                    deleteMany: {},
                    create: data.bestEmailDay.map((emailDayId) => ({
                      emailDay: { connect: { id: emailDayId } },
                    })),
                  }
                : { deleteMany: {} },

              emailTimes: data.bestEmailTime?.length
                ? {
                    deleteMany: {},
                    create: data.bestEmailTime.map((emailTimeId) => ({
                      emailTime: { connect: { id: emailTimeId } },
                    })),
                  }
                : { deleteMany: {} },

              smsDays: data.bestSmsDay?.length
                ? {
                    deleteMany: {},
                    create: data.bestSmsDay.map((smsDayId) => ({
                      smsDay: { connect: { id: smsDayId } },
                    })),
                  }
                : { deleteMany: {} },

              smsTimes: data.bestSmsTime?.length
                ? {
                    deleteMany: {},
                    create: data.bestSmsTime.map((smsTimeId) => ({
                      smsTime: { connect: { id: smsTimeId } },
                    })),
                  }
                : { deleteMany: {} },
            },
            include: {
              callDays: { include: { callDay: true } },
              callTimes: { include: { callTime: true } },
              emailDays: { include: { emailDay: true } },
              emailTimes: { include: { emailTime: true } },
              smsDays: { include: { smsDay: true } },
              smsTimes: { include: { smsTime: true } },
            },
          });

        return {
          id: communicationPreferences.id,
          profileId: communicationPreferences.profileId,
          phoneTypeId: communicationPreferences.phoneTypeId,
          internationalPrefixId: communicationPreferences.internationalPrefixId,
          phoneNumber: communicationPreferences.phoneNumber,
          phoneNumberExtension:
            communicationPreferences.phoneNumberExtension || undefined,
          faxNumber: communicationPreferences.faxNumber || undefined,
          createdBy: communicationPreferences.createdBy,
        };
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async checkIfArchiveProfileExist(data: ArchiveProfileRequestDto) {
    try {
      const archiveProfiles: CheckArchiveProfileDto =
        await this.prisma.profile.findMany({
          where: { id: { in: data.profileIds } },
          select: { id: true, archivedAt: true },
        });
      return archiveProfiles;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async archivePermission(data: ArchiveProfileRequestDto) {
    try {
      await this.prisma.profile.updateMany({
        where: { id: { in: data.profileIds } },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}

export default MasterProfileRepository;
