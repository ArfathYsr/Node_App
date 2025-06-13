export type AuditHistoryBodyDto = {
  referenceType: string;
  searchText?: string;
  offset: number;
  limit: number;
  type?: string;
  filter?: {
    startDate?: Date | null;
    endDate?: Date | null;
    changedBy?: number | null;
    field?: string | null;
  };
};

export type AuditHistoryResponseDto = {
  auditHistory: {
    fieldName: string;
    previousValue: string;
    newValue: string;
    modifiedBy: string;
    modifiedDateTime: Date;
  }[][];
  exportPath: string;
};

export type GetHistoryDetails = {
  id: number;
  referenceType: string;
  referenceId: number;
  changedBy: number;
  changedAt: Date;
  changedByProfile: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  fieldChange: {
    id: number;
    historyEventId: number;
    field: string;
    previousValue: string | null;
    newValue: string | null;
  }[];
}[];
export type GetFieldHistoryDetails = {
  id: number;
  historyEventId: number;
  field: string;
}[];
export type AuditFieldHistoryResponseDto = {
  fieldTypeName: string;
}[];
