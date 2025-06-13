import { inject, injectable } from 'inversify';
import config from 'config';
import { client } from '@prisma/client';
import TYPES from '../../dependencyManager/types';
import ClientRepository from '../repositories/clientRepository';
import {
  CreateClientDataToDbDto,
  CreateClientDto,
  CreateChildClientsDto,
  ClientListDataToDbDto,
  EditClientDto,
  EditClientDataToDbDto,
  EditChildClientDto,
  CreateClientResponseDto,
  ParentClientListDataToDbDto,
  ClientShortListDataToDbDto,
  ClientIdDto,
  GetClientNameReq,
} from '../dto/client.dto';
import { NotFoundError } from '../../error/notFoundError';
import { S3Service } from '../../libs/s3Service';
import TherapeuticAreaRepository from '../../therapeuticArea/repositories/therapeuticAreaRepository';
import { MESSAGES } from '../../utils/message';
import { prepareImageData } from '../../utils/preapareImageData';

@injectable()
export default class ClientService {
  private readonly clientRepository: ClientRepository;

  private readonly therapeuticAreaRepository: TherapeuticAreaRepository;

  private readonly s3Service: S3Service;

  private readonly s3Url: string;

  constructor(
    @inject(TYPES.ClientRepository) clientRepository: ClientRepository,
    @inject(TYPES.S3Service) s3Service: S3Service,
    @inject(TYPES.TherapeuticAreaRepository)
    therapeuticAreaRepository: TherapeuticAreaRepository,
  ) {
    this.clientRepository = clientRepository;
    this.s3Service = s3Service;
    this.s3Url = config.get<string>('aws.s3Url');
    this.therapeuticAreaRepository = therapeuticAreaRepository;
  }

  private getKeyForDeleteImage(url: string) {
    return url.replace(`${this.s3Url}/`, '');
  }

  async createChildClients(data: CreateChildClientsDto) {
    try {
      const parentClient = await this.clientRepository.findClientById(
        data.parentClientId,
      );
      if (!parentClient) {
        throw new Error(MESSAGES.PARENT_CLIENT_NOT_FOUND);
      }

      const {
        parentClientId,
        createdBy,
        updatedBy,
        ...restData
      }: CreateChildClientsDto = data;
      const clientNames: string[] = restData.clients.map(
        (clientId) => clientId.name,
      );
      const existingClients: client[] =
        await this.clientRepository.findClientsByNames(
          clientNames,
          parentClientId,
        );
      if (existingClients.length > 0) {
        const existingNames: string = existingClients
          .map((clientInfo) => clientInfo.name)
          .join(', ');
        throw new Error(MESSAGES.CLIENT_NAME_ALREADY_EXISTS(existingNames));
      }
      const childClients: CreateClientResponseDto[] = [];
      for (const clientDetail of restData.clients) {
        const createdClient: CreateClientResponseDto = await this.createClient({
          ...clientDetail,
          parentClientId,
          createdBy,
          updatedBy,
        });

        childClients.push(createdClient);
      }

      return {
        clients: childClients.map(({ client: childClient }) => childClient),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async createClient<T extends CreateClientDto>(data: T) {
    try {
      const { createdBy, updatedBy, name }: CreateClientDto = data;
      const addressTypeId: number = 1;
      const clientStatusId: number = 1;
      const currencyId: number = 1;
      const languageId: number = 1;

      const newData: CreateClientDataToDbDto = {
        ...data,
        logo: 'pending',
        clientAddress: [
          {
            ...data.clientAddress,
            createdBy,
            updatedBy,
            isActive: true,
            addressTypeId,
          },
        ],
        createdBy,
        updatedBy,
        clientStatusId,
        currencyId,
        languageId,
        therapeuticAreaId: data.therapeuticAreaId
          ? data.therapeuticAreaId
          : undefined,
      };
      // Check if a client with the same name already exists
      const existingClient: client[] =
        await this.clientRepository.findClientsByNames(
          name,
          newData.parentClientId,
        );
      // If the client name already exists, return an error message
      if (existingClient.length > 0) {
        throw new Error(MESSAGES.CLIENT_NAME_ALREADY_EXISTS(data.name));
      }

      if (data?.therapeuticAreaId) {
        const validtherapeuticAreaIds =
          await this.therapeuticAreaRepository.getExistingtherapeuticAreaIds(
            data.therapeuticAreaId,
          );
        const validIds: number[] = validtherapeuticAreaIds.map(
          (therapeuticArea) => therapeuticArea.id,
        );
        const invalidIds: number[] = data.therapeuticAreaId.filter(
          (id) => !validIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new Error(MESSAGES.THERAPEUTIC_AREA_ID_NOT_FOUND(invalidIds));
        }
      }

      const clientWithAddress: client =
        await this.clientRepository.createClient(newData);

      const {
        key,
        imageBuffer,
        contentType,
      }: { key: string; imageBuffer: Buffer; contentType: string } =
        prepareImageData(data.logo, clientWithAddress.id);

      await this.s3Service.uploadImage({
        key,
        body: imageBuffer,
        contentType,
      });

      const logoUrl: string = `${this.s3Url}/${key}`;

      await this.clientRepository.updateClient(clientWithAddress.id, {
        logo: logoUrl,
      });

      return {
        client: { id: clientWithAddress.id, logo: logoUrl },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getClientList(data: ClientListDataToDbDto) {
    try {
      const { clients, totalAmount, filters } =
        await this.clientRepository.getClientList(data);
      return {
        clients: clients.map(({ clientAddress, ...restClientData }) => ({
          ...restClientData,
          clientAddress: clientAddress[0],
        })),
        totalAmount,
        filters,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getShortClientList(data: ClientShortListDataToDbDto) {
    return this.clientRepository.getShortClientList(data);
  }

  async getClientById(clientId: number) {
    try {
      const clientData =
        await this.clientRepository.findClientByIdFullInfo(clientId);

      if (!clientData)
        throw new NotFoundError(MESSAGES.NOT_FOUND_CLIENTS_IDS(clientId));

      return {
        client: {
          ...clientData,
          clientAddress: clientData.clientAddress[0],
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getClientStatusList() {
    return this.clientRepository.clientStatusList();
  }

  async editClient<T extends EditClientDto>(clientId: number, data: T) {
    try {
      const { updatedBy }: EditClientDto = data;
      const getClientData =
        await this.clientRepository.findClientWithAddress(clientId);
      if (!getClientData) {
        throw new Error(MESSAGES.CLIENT_ID_ALREADY_EXISTS(clientId));
      }

      if (data?.therapeuticAreaId) {
        const validtherapeuticAreaIds =
          await this.therapeuticAreaRepository.getExistingtherapeuticAreaIds(
            data.therapeuticAreaId,
          );

        const validIds: number[] = validtherapeuticAreaIds.map(
          (therapeuticArea) => therapeuticArea.id,
        );
        const invalidIds: number[] = data.therapeuticAreaId.filter(
          (id) => !validIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new Error(MESSAGES.THERAPEUTIC_AREA_ID_NOT_FOUND(invalidIds));
        }
      }

      let newLogoUrl: string | undefined;
      if (data.logo) {
        const oldImgKey: string = this.getKeyForDeleteImage(getClientData.logo);
        const isImageExists: boolean =
          await this.s3Service.doesImageExist(oldImgKey);
        if (isImageExists) {
          await this.s3Service.deleteImage({ key: oldImgKey });
        }

        const {
          key,
          imageBuffer,
          contentType,
        }: { key: string; imageBuffer: Buffer; contentType: string } =
          prepareImageData(data.logo, clientId);

        await this.s3Service.uploadImage({
          key,
          body: imageBuffer,
          contentType,
        });

        newLogoUrl = `${this.s3Url}/${key}`;
      }

      const editData: EditClientDataToDbDto = {
        ...data,
        logo: newLogoUrl,
        clientAddress: [
          {
            ...data.clientAddress,
          },
        ],
        therapeuticAreaId: data.therapeuticAreaId
          ? data.therapeuticAreaId
          : undefined,
      };

      const clientWithAddress = await this.clientRepository.editClient(
        clientId,
        {
          ...editData,
          updatedBy,
        },
      );

      return {
        client: {
          id: clientWithAddress.id,
          logo: newLogoUrl ?? clientWithAddress.logo,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editChildClient(parentClientId: number, data: EditChildClientDto) {
    try {
      const parentClient = await this.clientRepository.findClientById(
        data.clientId,
      );
      if (!parentClient) {
        throw new Error(MESSAGES.PARENT_CLIENT_ID_NOT_FOUND(data.clientId));
      }

      const { clientId, ...restData }: EditChildClientDto = data;
      const dataToDb = { ...restData, parentClientId: parentClient.id };
      return await this.editClient(parentClientId, dataToDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getParentClientList(data: ParentClientListDataToDbDto) {
    return this.clientRepository.getParentClientList(data);
  }

  async deleteClients(clientIds: number[]) {
    try {
      const existingClients: ClientIdDto[] =
        await this.clientRepository.getExistingClientIds(clientIds);
      const existingIds: number[] = existingClients.map(
        (clients) => clients.id,
      );
      const missingIds: number[] = clientIds.filter(
        (id) => !existingIds.includes(id),
      );
      if (missingIds.length > 0) {
        throw new Error(
          MESSAGES.NOT_AVAILABLE_IDS_CLIENT(missingIds.join(', ')),
        );
      }
      return await this.clientRepository.deleteClients(clientIds);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getClientName(data: GetClientNameReq) {
      return this.clientRepository.getClientName(data);
    }
}
