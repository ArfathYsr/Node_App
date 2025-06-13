export type AddVenueChecklistDto = CreateVenueChecklistDto & {
  questions: QuestionsDto[];
};
export type CreateVenueChecklistDto = {
  vendorId: number;
  venueName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
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
export type VendorCreatedDataDto = {
  id: number;
  vendorId: number;
  questionCategoryId: number;
  questionTypeId: number;
  questionId: number;
  questionOptionId: number;
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
  }[];
} | null;

export type TypeValidationDetailsDTO = {
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
}[];
export type QuestionOptionDto = {
  id: number;
  displayOrder : number ;
  option: string;
  questionId : number,
  createdBy: number,
  createdAt: Date,
  updatedBy: number,
  updatedAt: Date,
  isActive : boolean
};

export type VendorVenueChecklistQuestions = {
  id: number;
  name: string;
  type: string;
};

export type VendorVenueDetails = {
  id: number;
  contactName: string;
  venueName: string;
  email: string;
  phoneNumber: string;
  vendorId: number;
  questions: VendorVenueChecklistQuestions[];
};

