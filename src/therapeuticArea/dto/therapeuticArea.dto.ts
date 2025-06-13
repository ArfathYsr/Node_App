export type CreateTherapeuticAreaDto = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
};

export type CreateTherapeuticAreaResponseDto = {
  id: number;
};
export type CreateTherapeuticAreaDataToDbDto = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
};

export type ViewTherapeuticAreaByIdDataResponseDto = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
};

export type EditTherapeuticAreaDto = {
  name: string;
  description: string;
  startDate: Date;
  endDate: string | Date | undefined;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
};
export type EditTherapeuticAreaResponseDto = {
  id: number;
};

export type TherapeuticArea = { id: number };
