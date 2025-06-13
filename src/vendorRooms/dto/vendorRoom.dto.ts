import { Prisma } from "@prisma/client";

export type VendorRoomResponseDto = {
  id: number;
};
export type AddVendorRoomBodyData = {
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  roomName: string;
  maxCapacity: number;
  rentalFee: number;
  vendorId: number;
  questions?: Array<{
    vendorId: number;
    questionCategoryId: number;
    questionOptionId: number;
    questionId: number;
    value: string;
    createdBy: number;
    updatedBy: number;
  }>;
};

export type VendorRoomListRequestDto = {
  sortBy: {
    field: string;
    order: string;
  };
  startDate?: Date;
  endDate?: Date;
  offset: number;
  limit: number;
  searchText?: string;
};

export interface SortCriteriaDTO {
  field: string;
  order: Prisma.SortOrder;
}

type SortOrderDto = 'asc' | 'desc';

export interface SortMappingDTO {
  roomName: { vendorRoom: { roomName: SortOrderDto } };
  maxCapacity: { vendorRoom: { maxCapacity: SortOrderDto } };
  rentalFee: { vendorRoom: { rentalFee: SortOrderDto } };
}

export type VendorRoomListResponseDto = {
  id: number;
  vendorId: number;
  roomName: string;
  maxCapacity: number;
  rentalFee: number;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
};


export type VendorRoomResponseDataDto ={
  vendorRoomList: VendorRoomListResponseDto[];
  totalAmount: number;
  totalPages: number;
  nextPage: boolean;
}


export type CreateRoomInfoDto = {
  vendorId: number;
  roomName: string;
  rentalFee: number;
  maxCapacity: number;
  createdBy: number;
  updatedBy: number;
};
export type ImageUploadData = {
  photo: string;
  name: string;
};
export type QuestionsDto = {
  questionId: number;
  questionOptionId?: number[];
  customValue?: string;
  fileURL?: string;
};

export type AddRoomInfoRequestDto = CreateRoomInfoDto & {
  questions: QuestionsDto[];
};

export type CreateRoomInfoResponseDto = {
  id: number;
  vendorId: number;
  roomName: string;
  rentalFee: number;
  maxCapacity: number;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
};

export type ExistingQuestionDataDto = {
  id: number;
  questionOptions: {
    id: number;
    option: string;
  }[]
} | null

export type TypeValidationDetailsDTO =  {
  id: number;
  questionId: number;
  typeValidation: {
      id: number;
      createdBy: number;
      createdAt: Date;
      updatedBy: number;
      updatedAt: Date;
      typeField: string;
      typeValue: string;
  };
}[]

export interface AddRoomInfoRepoResponseDto{
  roomInfo: CreateRoomInfoResponseDto;
  questionsInserted: Prisma.BatchPayload;
}

export type RoomDetailsResponseDto = {
  id: number;
  vendorId: number;
  roomName: string;
  maxCapacity: number;
  rentalFee: number;
  questionResponse: {
    question: {
      id: number;
      Question: string;
    };
    questionValidation: {
      id: number;
      questionId: number;
      typeValidationId: number;
    
      typeValidation: {
        id: number;
        typeField: string;
        typeValue: string;

      };
    }[];

    questionOption?: {
      id: number | null;
      option: string | null;
    };
    CustomValue: string;
    FileUrl?: string | null;
  }[];
};


