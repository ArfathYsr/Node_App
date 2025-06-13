export type LookupResponseData = {
  id: number;
  name: string;
};

export type QuestionList = {
  id: number;
  questionCategoryId: number;
  questionType: {
    id: number;
    name: string;
  };
  question: string;
  isActive: boolean;
  parentQuestionId: number | null;
  displayOrder: number;
  questionOptions:
    | {
        id: number;
        questionId: number;
        option: string;
        isActive: boolean;
        displayOrder: number;
      }[]
    | null;
}[];

export type QuestionListResponseDto = {
  questions: QuestionList;
  totalAmount: number;
};

export type ShortQuestionCategoryListDataToDbDto = {
  searchText?: string;
};

export type ShortQuestionCategoryListDataResponseDto = Array<{
  id: number;
  name: string;
}>;
