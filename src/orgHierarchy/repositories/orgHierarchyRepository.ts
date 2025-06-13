import { clientFunctionalArea, clientHierarchy, Prisma, PrismaClient, status } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import { AddHierarchyJsonResponse, AddHierarchyReqData, AddHierarchyResponseData, CloneHierarchyReqData, CreateHierarchyLevel, HierarchyLevel, ListOrgHierarchyBodyDto, SortBy, SortByCondition } from '../dto/orgHierarchy.dto';
import { repositoryError } from '../../utils/utils';

@injectable()
export default class OrgHierarchyRepository {
  static cloneClientOrgHierarchy(mockHierarchyData: AddHierarchyReqData) {
    throw new Error('Method not implemented.');
  }
  private readonly prisma: PrismaClient;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
  ) {
    this.prisma = prisma;
  }
  async listOrgHierarchy (data: ListOrgHierarchyBodyDto) {
    try {
      const { searchText, sortBy ,filter} = data;
      const whereCondition: Prisma.clientHierarchyWhereInput = await this.buildWhereConditionForOrgHierarchy(searchText,filter);
      const orderByCondition: SortByCondition = await this.buildSortByConditionForOrgHierarchy(sortBy);
      const hierarchyList: clientHierarchy[] = await this.prisma.clientHierarchy.findMany({
        where: whereCondition,
        orderBy: orderByCondition,
        skip: data.offset,
        take: data.limit,
        include: {
          hierarchyLevel: true,
          status: true,
          client: true,
        }
      });
      const hierarchyCount : number = await this.prisma.clientHierarchy.count({ where: whereCondition });
      return {
        clientHierarchyList: hierarchyList || [],
        totalAmount: hierarchyCount || 0,
      };

    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }
  async buildWhereConditionForOrgHierarchy(searchText?: string,filter ?: { clientName ?: string[] , status ?: number[]} ) {
    try {
      const whereClause: Prisma.clientHierarchyWhereInput = {};
      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }
      if (Array.isArray(filter?.clientName) && filter.clientName.length > 0) {
        whereClause.client = { name: { in: filter.clientName } };
      }
      if (Array.isArray(filter?.status) && filter?.status?.length !== 0) {
        whereClause.statusId = { in: filter?.status };
      }
      return whereClause;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }
  private async buildSortByConditionForOrgHierarchy(
    sortBy: SortBy | undefined
  ): Promise<SortByCondition> {
    if (!sortBy) {
      return {
        status: { statusName: 'asc' },
        effectiveDate: 'desc',
      };
    }
  
    const validSortFields = ['name', 'numberOfLevels', 'effectiveDate', 'endDate', 'fieldReleaseDate'];
    const { field, order } = sortBy;
  
    if (field === 'statusName' ) {
      return { status: { statusName: order } };
    }
    if (field === 'clientName') {
      return { client: { name: order } };
    }
  
    if (validSortFields.includes(field)) {
      return { [field]: order };
    }
  
    return {
      status: { statusName: 'asc' },
      effectiveDate: 'desc',
    };
  }  
  async cloneClientOrgHierarchy(data: AddHierarchyReqData) {
    const { hierarchyLevels, ...clientHierarchyData } = data;
    
    try {
      const cloneHierarchy : AddHierarchyJsonResponse= await this.prisma.$transaction(async (prisma) => {
        const { type, ...validClientHierarchyData } = clientHierarchyData;

        const createdRecords :AddHierarchyResponseData= await prisma.clientHierarchy.create({
          data: validClientHierarchyData,
        });

        const createdHierarchyLevels : CreateHierarchyLevel= hierarchyLevels?.length 
          ? await Promise.all(
              hierarchyLevels.map((level: HierarchyLevel) =>
                prisma.hierarchyLevel.create({
                  data: {
                    name: level.name,
                    allowMultipleLevelValue: level.allowMultipleLevelValue,
                    isActive: level.isActive,
                    levelOrder: level.levelOrder,
                    clientHierarchyId: createdRecords.id,
                    parentHierarchyLevelId: level?.parentHierarchyLevelId || null,
                    createdBy: data.createdBy,
                    updatedBy: data.updatedBy,
                  },
                })
              )
            )
          : [];

        return {
          id: createdRecords.id,
          clientOrgHierarchyName: createdRecords.name,
          createdHierarchyLevels,
        };
      });


      return cloneHierarchy ;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }
}