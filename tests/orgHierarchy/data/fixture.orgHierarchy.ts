import { clientHierarchy } from '@prisma/client';
import { AddHierarchyReqData, HierarchyLevel, ListOrgHierarchyBodyDto } from '../../../src/orgHierarchy/dto/orgHierarchy.dto';

export const mockData: ListOrgHierarchyBodyDto = {
      searchText: '',
      offset: 0,
      limit: 10,
      sortBy: {
        field: 'id',
        order: 'asc'
      },
    };

export const mockHierarchyList: clientHierarchy[] = [
        {
          id: 1,
          name: 'Test New',
          description: 'xyz',
          numberOfLevels: 1,
          statusId: 1,
          effectiveDate: new Date('2025-03-20 12:33:18.7090000'),
          endDate: new Date('2025-03-20 12:33:18.7090000'),
          fieldReleaseDate: new Date('2025-03-20 12:33:18.7090000'),
          cloneId: null,
          createdBy: 9,
          createdAt: new Date('2025-03-20 13:05:39.9730000'),
          updatedBy: 9,
          updatedAt: new Date('2025-03-20 13:05:39.9730000'),
          clientId: 1,
        },
      ];

export const mockHierarchyData: AddHierarchyReqData = {
    name: 'Test Hierarchy',
    description: 'Test Description',
    numberOfLevels: 2,
    statusId: 1,
    effectiveDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    fieldReleaseDate: new Date().toISOString(),
    createdBy: 1, // Changed from string to number
    updatedBy: 1, // Changed from string to number
    hierarchyLevels: [
      {
        name: 'Level 1',
        allowMultipleLevelValue: true,
        isActive: true,
        levelOrder: 1,
        parentHierarchyLevelId: null,
      },
      {
        name: 'Level 2',
        allowMultipleLevelValue: false,
        isActive: true,
        levelOrder: 2,
        parentHierarchyLevelId: 1,
      },
    ],
  };
  
  export const mockHierarchyDataWithoutLevels: AddHierarchyReqData = {
    ...mockHierarchyData,
    hierarchyLevels: [],
  };
  
  export const invalidHierarchyData = {
    description: 'Invalid Data',
    createdBy: 1,
    updatedBy: 1,
    hierarchyLevels: []
  } as unknown as AddHierarchyReqData;
  
  export const mockCloneResponse = {
    id: 1,
    clientOrgHierarchyName: 'Test Hierarchy',
    createdHierarchyLevels: [
      {
        id: 1,
        name: 'Level 1',
        allowMultipleLevelValue: true,
        isActive: true,
        levelOrder: 1,
        clientHierarchyId: 1,
        parentHierarchyLevelId: null,
        createdBy: 1, // Number to match DTO
        updatedBy: 1, // Number to match DTO
      },
    ],
  };
  
  export const mockHierarchyLevels: HierarchyLevel[] = [
    {
      name: 'Level 1',
      allowMultipleLevelValue: true,
      isActive: true,
      levelOrder: 1,
      parentHierarchyLevelId: null,
    },
  ];