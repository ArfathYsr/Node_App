import { Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import InfoService from '../services/infoService';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import { version } from '../../../package.json';
import { AuditHistoryBodyDto, AuditHistoryResponseDto } from '../dto/info.dto';

@injectable()
export default class InfoController {
  constructor(
    @inject(TYPES.InfoService) private readonly infoService: InfoService,
  ) {}

  async getCountries(_req: CustomRequest, res: Response) {
    const countries = await this.infoService.getCountryList();
    res.status(HttpStatusCode.Ok).json({ countries });
  }

  async getVersion(_req: CustomRequest, res: Response) {
    res.status(200).json({ version });
  }

  async getAuditHistory(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: AuditHistoryBodyDto = req.body;
      const results: AuditHistoryResponseDto =
        await this.infoService.getAuditHistory(data);
      res.status(HttpStatusCode.Ok).json({ results });
    } catch (error) {
      next(error);
    }
  }

  async getTimezone(_req: CustomRequest, res: Response) {
    const timezone = await this.infoService.getTimezoneList();
    res.status(HttpStatusCode.Ok).json({ timezone });
  }

  async getLocale(_req: CustomRequest, res: Response) {
    const locale = await this.infoService.getLocaleList();
    res.status(HttpStatusCode.Ok).json({ locale });
  }
}
