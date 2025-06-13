import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import ClientService from '../services/clientService';
import { CustomRequest } from '../../types/express';
import { MESSAGES } from '../../utils/message';
import {
  CreateClientDto,
  CreateClientResponseDto,
  ClientListDataToDbDto,
  EditClientDto,
  ClientByIdDataResponseDto,
  ClientListDataResponseDto,
  CreateChildClientsResponseDto,
  CreateChildClientsDto,
  EditChildClientDto,
  ParentClientListResponseDto,
  ParentClientListDataToDbDto,
  ClientShortListDataToDbDto,
  ClientShortListDataResponseDto,
  GetClientNameReq,
  GetClientNameRes,
} from '../dto/client.dto';

@injectable()
export default class ClientController {
  constructor(
    @inject(TYPES.ClientService) private readonly clientService: ClientService,
  ) {}

  async createChildClients(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: CreateChildClientsDto = req.body;
      const clients: CreateChildClientsResponseDto =
        await this.clientService.createChildClients({
          ...data,
          createdBy,
          updatedBy,
        });
      res.status(HttpStatusCode.Created).json(clients);
    } catch (error) {
      next(error);
    }
  }

  async createClient(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: CreateClientDto = req.body;
      const client: CreateClientResponseDto =
        await this.clientService.createClient({
          ...data,
          createdBy,
          updatedBy,
        });
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async getClientList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ClientListDataToDbDto = req.body;
      const clientList: ClientListDataResponseDto =
        await this.clientService.getClientList(data);

      res.json({ clientList });
    } catch (error) {
      next(error);
    }
  }

  async getShortClientList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ClientShortListDataToDbDto = req.body;
      const clientList: ClientShortListDataResponseDto =
        await this.clientService.getShortClientList(data);
      res.status(HttpStatusCode.Ok).json({ clientList });
    } catch (error) {
      next(error);
    }
  }

  async getClient(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const client: ClientByIdDataResponseDto =
        await this.clientService.getClientById(parseInt(req.params.id, 10));

      res.json(client);
    } catch (err) {
      next(err);
    }
  }

  async getClientStatuses(_req: CustomRequest, res: Response) {
    const statuses = await this.clientService.getClientStatusList();
    res.status(HttpStatusCode.Ok).json({ statuses });
  }

  async editClient(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: EditClientDto = req.body;
      const client: CreateClientResponseDto =
        await this.clientService.editClient(parseInt(req.params.id, 10), {
          ...data,
          updatedBy,
        });
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async editChildClient(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: EditChildClientDto = req.body;
      const client: CreateClientResponseDto =
        await this.clientService.editChildClient(parseInt(req.params.id, 10), {
          ...data,
          updatedBy,
        });
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async getParentClientList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ParentClientListDataToDbDto = req.body;
      const clientList: ParentClientListResponseDto =
        await this.clientService.getParentClientList(data);

      res.json({ clientList });
    } catch (error) {
      next(error);
    }
  }

  async deleteClients(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.CLIENT_ID_REQUIRED });
      }
      const clientIds: number[] =
        typeof ids === 'string' ? ids.split(',').map(Number) : [];

      if (clientIds.length === 0 || clientIds.some((id) => Number.isNaN(id))) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.INVALID_CLIENTS_IDS });
      }

      await this.clientService.deleteClients(clientIds);

      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.CLIENT_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientName(req: CustomRequest, res: Response, next: NextFunction) {
      try {
        const data: GetClientNameReq = req.body;
        const clientList: GetClientNameRes =
          await this.clientService.getClientName(data);
        res.status(HttpStatusCode.Ok).json(clientList);
      } catch (error) {
        next(error);
      }
    }
}
