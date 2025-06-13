import { inject, injectable } from 'inversify';
import config from 'config';
import { COMMON, TypeField } from '../../utils/common';
import TYPES from '../../dependencyManager/types';
import VendorRoomRepository from '../repositories/vendorRoomRepository';
import {
  AddRoomInfoRepoResponseDto,
  AddRoomInfoRequestDto,
  ExistingQuestionDataDto,
  QuestionsDto,
  TypeValidationDetailsDTO,
  VendorRoomListRequestDto,
  RoomDetailsResponseDto,
} from '../dto/vendorRoom.dto';
import { VENDOR_ROOM_MESSAGES } from '../../utils/Messages/vendorRoomMessage';
import { NotFoundError } from '../../error/notFoundError';
import { ValidationError } from '../../error/validationError';
import { isBase64Image } from '../../utils/isBase64Image';
import { checkBase64FileSize } from '../../utils/validateFileSize';
import { vendorRoom } from '@prisma/client';
import { BadRequestError } from '../../error/badRequestError';



@injectable()
export default class VendorRoomService {
  constructor(
    @inject(TYPES.VendorRoomRepository)
    private readonly vendorRoomRepository: VendorRoomRepository
  ) {}

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>(COMMON.DEFAULT_ENTITY_AND_DATE));
  }

  private async validateData(vendorId: number, questions: QuestionsDto[]): Promise<void> {
    try {
      const vendorData: number | null = await this.vendorRoomRepository.findVendorById(vendorId);
  
      if (!vendorData) {
        throw new NotFoundError(VENDOR_ROOM_MESSAGES.INVALID_VENDOR_ID(vendorId));
      }  
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
    const existingQuestionDetails:ExistingQuestionDataDto = await this.vendorRoomRepository.findQuestionById(question.questionId);
  
    if (!existingQuestionDetails) {
      throw new NotFoundError(VENDOR_ROOM_MESSAGES.INVALID_QUESTION_ID(question.questionId));
    }
  
    if (question?.questionOptionId) {
      const existingOptionIds: Set<number> = new Set(existingQuestionDetails.questionOptions.map((option) => option.id));
      const optionIdsArray: number[] = Array.isArray(question.questionOptionId) ? question.questionOptionId : [question.questionOptionId];
      const missingOptionIds:number[] = optionIdsArray.filter((id: number) => !existingOptionIds.has(id));
      
      if (missingOptionIds.length > 0) {
        throw new NotFoundError(VENDOR_ROOM_MESSAGES.INVALID_OPTION_IDS(question.questionId, missingOptionIds));
      }
    }
    
    const { questionOptions } = existingQuestionDetails;

    if (questionOptions?.length) {
        if (!question.questionOptionId || question.customValue) {
            throw new ValidationError(VENDOR_ROOM_MESSAGES.INVALID_VALUE_AND_OPTION(questionOptions.map(item => item.id)));
        }
        const optionIdsArray: number[] = Array.isArray(question.questionOptionId) ? question.questionOptionId : [question.questionOptionId];
        const existingOptionIds: Set<number> = new Set(questionOptions.map(option => option.id));
        const missingOptionIds: number[] = optionIdsArray.filter(id => !existingOptionIds.has(id));

        if (missingOptionIds.length > 0) {
            throw new NotFoundError(VENDOR_ROOM_MESSAGES.INVALID_OPTION_IDS(question.questionId, missingOptionIds));
        }
    } else if ((!questionOptions.length && question.customValue === undefined) || (!questionOptions.length && question.questionOptionId)) {
        throw new ValidationError(VENDOR_ROOM_MESSAGES.CUSTOM_VALUE(question.questionId));
    }

  
    await this.validateQuestionType(question);
  }
  
  private async validateQuestionType(question: QuestionsDto) {
    const typeValidationDetails:TypeValidationDetailsDTO | null = await this.vendorRoomRepository.findQuestionAndTypevalidationById(question.questionId);
    
    if(typeValidationDetails){
      for (const type of typeValidationDetails) {
      if (type.typeValidation.typeField === TypeField.FILE_SIZE && question?.customValue) {
        if (!checkBase64FileSize(question.customValue, type.typeValidation.typeValue)) {
          throw new ValidationError(VENDOR_ROOM_MESSAGES.FILE_SIZE_EXCEED(type.typeValidation.typeValue));
        }
      } else if (type.typeValidation.typeField === TypeField.FILE_FORMATE && question?.customValue) {
        if (!isBase64Image(question.customValue)) {
          throw new ValidationError(VENDOR_ROOM_MESSAGES.INVALID_BASE64_FILE);
        }
      } else if (type.typeValidation.typeField === TypeField.TEXT_LENGTH && question?.customValue) {
        if (question.customValue.length > parseInt(type.typeValidation.typeValue, 10)) {
          throw new ValidationError(VENDOR_ROOM_MESSAGES.INVALID_TEXT_LENGTH(type.typeValidation.typeValue));
        }
      }
    }}
  };  

  async addRoomInfoAndQuestionnair(data:AddRoomInfoRequestDto):Promise<AddRoomInfoRepoResponseDto> {
    try {
      const {
        vendorId,
        questions,
      }: { vendorId: number; questions: QuestionsDto[] } = data;
        await this.validateData(vendorId, questions);
        return await this.vendorRoomRepository.addRoomInfoAndQuestionnair({...data})
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async roomList() {
    try{
      return await this.vendorRoomRepository.roomListData();
    }catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
    
  }

  async getRoomDetailsById(roomId: number) {
    try {
      const roomData: vendorRoom | null =
        await this.vendorRoomRepository.findRoomById(roomId);

      if (!roomData) {
        throw new BadRequestError(VENDOR_ROOM_MESSAGES.ROOM_NOT_FOUND(roomId));
      }

      const roomDetails: RoomDetailsResponseDto | null =
        await this.vendorRoomRepository.getRoomDetailsById(roomId);
      return roomDetails;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

}
