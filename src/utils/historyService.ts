import { injectable, inject } from 'inversify';
import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import TYPES from '../dependencyManager/types';
import RepositoryError from '../error/repositoryError';
import { AuditHistoryBodyDto, GetHistoryDetails } from '../info/dto/info.dto';
import { S3Service } from '../libs/s3Service';
import { COMMON } from './common';

interface FieldChange {
  field: string;
  previousValue: string;
  newValue: string;
}

@injectable()
export default class HistoryService {
  private readonly prisma: PrismaClient;

  private readonly s3Service: S3Service;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.S3Service) s3Service: S3Service,
  ) {
    this.s3Service = s3Service;
    this.prisma = prisma;
  }

  async trackFieldChanges(
    recordType: string,
    recordId: number,
    updatedData: Record<string, any>,
    changedBy: number,
    previousDataFromAPI?: string | '',
  ) {
    try {
      // Fetch all related tables for this recordType
      const tableRelations = await this.prisma.tableRelation.findMany({
        where: { currentTable: recordType },
      });

      // Fetch current record for comparison, including all related fields
      const currentRecord = await this.fetchCurrentRecord(
        recordType,
        recordId,
        tableRelations,
      );

      const fieldChanges: FieldChange[] = [];
      const currentDate: Date = new Date();
      const processedFields = new Set<string>(); // Track unique fields

      for (const field of Object.keys(updatedData)) {
        let previousValue;
        let newValue;
        let fieldName = field;

        // Find all relations matching this field
        const relations = tableRelations.filter(
          (rel) => rel.fieldName === field,
        );

        if (relations.length > 0) {
          for (const relation of relations) {
            const modelName = relation.masterTable;

            if (processedFields.has(modelName)) {
              continue; // Skip if already processed
            }

            const model = this.prisma[modelName as keyof PrismaClient] as any;
            let newRecords;

            if (relation.relationTable) {
              // Handle Many-to-Many
              if (Array.isArray(updatedData[field])) {
                newRecords =
                  updatedData[field].length > 0
                    ? await model.findMany({
                        where: { id: { in: updatedData[field] } },
                        select: { name: true },
                      })
                    : [];
              } else {
                const newRecord = updatedData[field]
                  ? await model.findUnique({
                      where: { id: updatedData[field] },
                      select: { name: true },
                    })
                  : null;
                newRecords = newRecord ? [newRecord] : [];
              }

              previousValue = currentRecord?.[`${relation.masterTable}Names`]
                ? currentRecord[`${relation.masterTable}Names`].join(',')
                : previousDataFromAPI || '';

              newValue =
                newRecords.length > 0
                  ? newRecords.map((record) => record.name).join(',')
                  : '';

              fieldName = `${relation.masterTable}Names`;
            } else {
              // Handle One-to-One
              previousValue =
                currentRecord[`${relation.masterTable}Name`] || '';
              newValue = updatedData[field]
                ? (
                    await model.findUnique({
                      where: { id: updatedData[field] },
                      select: { name: true },
                    })
                  )?.name || ''
                : '';

              fieldName = `${relation.masterTable}Name`;
            }

            if (!processedFields.has(fieldName)) {
              fieldChanges.push({ field: fieldName, previousValue, newValue });
              processedFields.add(fieldName); // Mark as processed
            }
          }
        } else if (field === 'createdBy' || field === 'updatedBy') {
          // Handle createdBy / updatedBy separately
          const previousProfile = currentRecord?.createdBy
            ? await this.prisma.profile.findUnique({
                where: { id: currentRecord[field] },
                select: { firstName: true, lastName: true },
              })
            : null;

          const newProfile = updatedData[field]
            ? await this.prisma.profile.findUnique({
                where: { id: updatedData[field] },
                select: { firstName: true, lastName: true },
              })
            : null;

          previousValue = previousProfile
            ? `${previousProfile.firstName} ${previousProfile.lastName}`
            : '';
          newValue = `${newProfile?.firstName} ${newProfile?.lastName}` || '';
        } else {
          previousValue =
            currentRecord[field]?.toString() || previousDataFromAPI || '';
          newValue = updatedData[field]?.toString() || '';
        }

        if (!processedFields.has(fieldName)) {
          fieldChanges.push({ field: fieldName, previousValue, newValue });
          processedFields.add(fieldName); // Mark as processed
        }
      }

      // Save changes only if something was modified
      if (fieldChanges.length > 0) {
        await this.prisma.historyEvent.create({
          data: {
            referenceType: recordType,
            referenceId: recordId,
            changedBy,
            changedAt: currentDate,
            fieldChange: {
              create: fieldChanges,
            },
          },
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  private async fetchCurrentRecord(
    tableName: string,
    recordId: number,
    tableRelations: any[],
  ): Promise<Record<string, any>> {
    if (!recordId) return {};

    // Construct dynamic includes for relations
    const relatedTableInclude = tableRelations.reduce(
      (acc, relation) => {
        if (relation.relationTable) {
          // Handle many-to-many relationships (via relation table)
          acc[relation.relationTable] = {
            select: {
              [relation.masterTable]: {
                select: {
                  name: true,
                },
              },
            },
          };
        } else {
          // Handle direct one-to-one relationships
          acc[relation.masterTable] = {
            select: {
              name: true,
            },
          };
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // ✅ Handle Profile-Email Relationship
    if (tableName === 'profile') {
      relatedTableInclude['email'] = {
        select: {
          emailAddress: true,
        },
      };
    }

  // ✅ Handle Profile-Phone Relationship
  if (tableName === 'profile') {
    relatedTableInclude['phone'] = {
      select: {
        phoneNumber: true,
      },
    };
  }

    // ✅ Handle Profile-Status Relationship
    if (tableName === 'profile') {
      relatedTableInclude['profileStatus'] = {
        select: {
          statusName: true,
        },
      };
    }

    // Fetch the current record with dynamic includes
    let currentRecord = recordId
      ? await this.prisma[tableName].findUnique({
          where: { id: recordId },
          include: relatedTableInclude,
        })
      : {};

    // Process related records
    if (currentRecord) {
      tableRelations.forEach((relation) => {
        if (relation.relationTable) {
          // Handle many-to-many relationships
          if (currentRecord[relation.relationTable]) {
            currentRecord[`${relation.masterTable}Names`] = currentRecord[
              relation.relationTable
            ].map((relatedRecord) => relatedRecord[relation.masterTable]?.name);
          }
        } else {
          // Handle one-to-one relationships
          if (currentRecord[relation.masterTable]) {
            currentRecord[`${relation.masterTable}Name`] =
              currentRecord[relation.masterTable].name;
          }
        }
      });
    if (tableName === 'profile' && Array.isArray(currentRecord.email) && currentRecord.email.length > 0) {
      currentRecord['email'] = currentRecord.email[0].emailAddress;
    } else {
      currentRecord['email'] = '';
    }

    if (tableName === 'profile' && Array.isArray(currentRecord.phone) && currentRecord.phone.length > 0) {
      currentRecord['phoneNumber'] = currentRecord.phone[0].phoneNumber;
    } else {
      currentRecord['phoneNumber'] = '';
    }

      // ✅ Process Delegate User (Convert delegateId → delegateUser)
    if (tableName === 'profile' && currentRecord.delegateId) {
      const delegateUserRecord = await this.prisma.profile.findFirst({where: {id: currentRecord.delegateId}});
      currentRecord['delegateUser'] = delegateUserRecord? delegateUserRecord['identityId'] : ''
    } else {
      currentRecord['delegateUser'] = '';
    }

   // ✅ Process Profile Status
    if (tableName === 'profile' && currentRecord.profileStatus) {
      currentRecord['statusName'] = currentRecord.profileStatus.statusName;
    } else {
      currentRecord['statusName'] = '';
    }


  }
    return currentRecord;
  }

  async getAuditHistory(data: AuditHistoryBodyDto) {
    try {
      const { referenceType, searchText, offset, limit, filter, type } = data;

      const whereClause: Prisma.historyEventWhereInput = {
        referenceType,
      };
      let exportPath = '';

      if (filter) {
        if (filter.startDate && filter.endDate) {
          whereClause.changedAt = {
            gte: filter.startDate,
            lte: filter.endDate,
          };
        }
        if (filter.changedBy && filter.changedBy !== 0) {
          whereClause.changedByProfile = {
            id: filter.changedBy,
          };
        }
      }

      if (searchText) {
        whereClause.OR = [
          {
            fieldChange: {
              some: {
                OR: [
                  { field: { contains: searchText } },
                  {
                    previousValue: {
                      contains: searchText,
                    },
                  },
                  { newValue: { contains: searchText } },
                ],
              },
            },
          },
          {
            changedByProfile: {
              firstName: { contains: searchText },
              lastName: { contains: searchText },
            },
          },
        ];
      }
      const getDetails: GetHistoryDetails =
        await this.prisma.historyEvent.findMany({
          where: whereClause,
          orderBy: { changedAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            fieldChange: true,
            changedByProfile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

      const historyRecords = getDetails.map((event) => {
        const filteredFieldChanges = event.fieldChange.filter((fc) => {
          if (filter?.field && fc.field !== filter.field) {
            return false;
          }
          return true;
        });

        return filteredFieldChanges.map((fc) => ({
          id: fc.id,
          fieldName: fc.field,
          previousValue: fc.previousValue ?? '',
          newValue: fc.newValue ?? '',
          modifiedBy:
            `${event.changedByProfile?.firstName ?? ''} ${event.changedByProfile?.lastName ?? ''}`.trim(),
          modifiedDateTime: event.changedAt,
        }));
      });

      // : AuditHistoryResponseDto =
      if (type === 'export' && historyRecords && historyRecords.length !== 0) {
        exportPath = await this.exportAuditHistoryToCsv(historyRecords);
      }
      return {
        auditHistory: historyRecords,
        exportPath,
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async exportAuditHistoryToCsv(historyRecord: any[]): Promise<string> {
    const dirPath = path.join(process.cwd(), 'export', 'auditHistory');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fileName = 'audit-history.csv';
    const filePath = path.join(dirPath, fileName);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'fieldName', title: 'Field Name' },
        { id: 'previousValue', title: 'Previous Value' },
        { id: 'newValue', title: 'New Value' },
        { id: 'modifiedBy', title: 'ModifiedBy' },
        { id: 'modifiedDateTime', title: 'Modified DateTime' },
      ],
    });

    const formattedData = historyRecord.flat().map((item) => ({
      id: item.id,
      fieldName: item.fieldName,
      previousValue: item.previousValue || '',
      newValue: item.newValue || '',
      modifiedBy: item.modifiedBy,
      modifiedDateTime: new Date(item.modifiedDateTime).toISOString(),
    }));

    await csvWriter.writeRecords(formattedData);
    const fileContent = fs.readFileSync(filePath);

    const s3Key = `${COMMON.AUDITEXPORTPATH}/${fileName}`;
    const s3Url = await this.s3Service.uploadImage({
      key: s3Key,
      body: fileContent,
      contentType: 'text/csv',
    });
    fs.unlinkSync(filePath);

    return s3Url;
  }
}
