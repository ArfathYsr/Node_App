import { NotFoundError } from '../error/notFoundError';
import { MESSAGES } from './message';

interface RepositoryMethodDto {
  (ids: number[]): Promise<{ id: number }[]>;
}

type CheckIdResponseDto = (
  ids: number[] | undefined,
  repositoryMethod: RepositoryMethodDto,
  entityName: string,
) => Promise<void>;

type ExistingEntitiesDto = {
  id: number;
}[];

export const checkRoleId: CheckIdResponseDto = async (
  ids: number[] | undefined,
  repositoryMethod: RepositoryMethodDto,
  entityName: string,
): Promise<void> => {
  try {
    if (ids?.length) {
      const existingEntities: ExistingEntitiesDto = await repositoryMethod(ids);

      const existingIds: Set<number> = new Set(
        existingEntities?.map((item) => item.id),
      );
      const missingIds: number[] = ids?.filter((id) => !existingIds.has(id));

      if (missingIds.length > 0) {
        throw new NotFoundError(MESSAGES.INVALID_IDS(missingIds, entityName));
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
};
export const checkIds: CheckIdResponseDto = async (
  ids: number[] | undefined,
  repositoryMethod: RepositoryMethodDto,
  entityName: string
): Promise<void> => {
  try {
    if (ids?.length) {
      const existingEntities: ExistingEntitiesDto = await repositoryMethod(ids);

      const existingIds: Set<number> = new Set(
        existingEntities?.map((item) => item.id)
      );
      const missingIds: number[] = ids?.filter((id) => !existingIds.has(id));

      if (missingIds.length > 0) {
        throw new NotFoundError(MESSAGES.INVALID_IDS(missingIds, entityName));
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
};
