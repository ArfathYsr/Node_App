import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import {
  AddVenueChecklistDto,
  ExistingQuestionDataDto,
  QuestionsDto,
  TypeValidationDetailsDTO,
} from '../dto/vendorVenueChecklist.dto';
import { TypeField } from '../../utils/common';
import ClientRepository from '../../client/repositories/clientRepository';
import VendorVenueChecklistRepository from '../repositories/vendorVenueChecklistRepository';
import { MESSAGES } from '../../utils/message';
import { isBase64Image } from '../../utils/isBase64Image';
import { VENDOR_ROOM_MESSAGES } from '../../utils/Messages/vendorRoomMessage';
import { NotFoundError } from '../../error/notFoundError';
import { ValidationError } from '../../error/validationError';
import { checkBase64FileSize } from '../../utils/validateFileSize';
import { VENDOR_MESSAGES } from '../../utils/Messages/vendorMessage';

@injectable()
export default class VendorVenueChecklistService {
  constructor(
    @inject(TYPES.VendorVenueChecklistRepository)
    private readonly vendorVenueChecklistRepository: VendorVenueChecklistRepository,
    @inject(TYPES.ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  async addVenueCheckList(data: AddVenueChecklistDto) {
    try {
      const vendorData: number | null =
        await this.vendorVenueChecklistRepository.vendorById(data?.vendorId);

      if (!vendorData) {
        throw new NotFoundError(MESSAGES.VENDOR_ID(data?.vendorId));
      }

      const { questions }: { questions: QuestionsDto[] } = data;
      await this.validateData(questions);

      return await this.vendorVenueChecklistRepository.addVenueCheckList({
        ...data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  private async validateData(questions: QuestionsDto[]): Promise<void> {
    try {
      for (const question of questions) {
        await this.validateQuestion(question);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  private async validateQuestion(question: QuestionsDto): Promise<void> {
    const existingQuestionDetails: ExistingQuestionDataDto =
      await this.vendorVenueChecklistRepository.findQuestionById(
        question.questionId,
      );

    if (!existingQuestionDetails) {
      throw new NotFoundError(
        VENDOR_ROOM_MESSAGES.INVALID_QUESTION_ID(question.questionId),
      );
    }

    if (question?.questionOptionId) {
      const existingOptionIds: Set<number> = new Set(
        existingQuestionDetails?.questionOptions.map((option) => option.id),
      );
      const optionIdsArray: number[] = Array.isArray(question.questionOptionId)
        ? question.questionOptionId
        : [question.questionOptionId];
      const missingOptionIds: number[] = optionIdsArray.filter(
        (id: number) => !existingOptionIds.has(id),
      );

      if (missingOptionIds.length > 0) {
        throw new NotFoundError(
          VENDOR_ROOM_MESSAGES.INVALID_OPTION_IDS(
            question.questionId,
            missingOptionIds,
          ),
        );
      }
    }

    if (
      existingQuestionDetails.questionOptions.length === 0 &&
      question?.customValue === undefined
    ) {
      throw new ValidationError(
        VENDOR_ROOM_MESSAGES.CUSTOM_VALUE(question.questionId),
      );
    }

    await this.validateQuestionType(question);
  }

  private async validateQuestionType(question: QuestionsDto) {
    const typeValidationDetails: TypeValidationDetailsDTO | null =
      await this.vendorVenueChecklistRepository.findQuestionAndTypevalidationById(
        question.questionId,
      );

    if (typeValidationDetails) {
      for (const type of typeValidationDetails) {
        if (
          type.typeValidation.typeField === TypeField.FILE_SIZE &&
          question?.customValue
        ) {
          if (
            !checkBase64FileSize(
              question.customValue,
              type.typeValidation.typeValue,
            )
          ) {
            throw new ValidationError(
              VENDOR_ROOM_MESSAGES.FILE_SIZE_EXCEED(
                type.typeValidation.typeValue,
              ),
            );
          }
        } else if (
          type.typeValidation.typeField === TypeField.FILE_FORMATE &&
          question?.customValue
        ) {
          if (!isBase64Image(question.customValue)) {
            throw new ValidationError(VENDOR_ROOM_MESSAGES.INVALID_BASE64_FILE);
          }
        } else if (
          type.typeValidation.typeField === TypeField.TEXT_LENGTH &&
          question?.customValue
        ) {
          if (
            question.customValue.length >
            parseInt(type.typeValidation.typeValue, 10)
          ) {
            throw new ValidationError(
              VENDOR_ROOM_MESSAGES.INVALID_TEXT_LENGTH(
                type.typeValidation.typeValue,
              ),
            );
          }
        }
      }
    }
  }

  async getVendorVenueCheckListDetails(vendorId: number) {
    try {
      const vendorExists = await this.vendorVenueChecklistRepository.vendorById(vendorId)

      if (!vendorExists) {
        throw new NotFoundError( VENDOR_MESSAGES.VENDOR_NOT_FOUND(vendorId))
      }
      return await this.vendorVenueChecklistRepository.getVendorVenueCheckListDetails(vendorId)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}
