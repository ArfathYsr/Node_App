import { inject, injectable } from 'inversify';
import CountryRepository from '../repositories/countryRepository';
import TYPES from '../../dependencyManager/types';
import HistoryService from '../../utils/historyService';
import { AuditHistoryBodyDto } from '../dto/info.dto';

@injectable()
export default class InfoService {
  private readonly countryRepository: CountryRepository;

  private readonly historyService: HistoryService;

  constructor(
    @inject(TYPES.CountryRepository) countryRepository: CountryRepository,
    @inject(TYPES.HistoryService) historyService: HistoryService,
  ) {
    this.countryRepository = countryRepository;
    this.historyService = historyService;
  }

  async getCountryList() {
    return this.countryRepository.countryList();
  }

  async getAuditHistory(data: AuditHistoryBodyDto) {
    return this.historyService.getAuditHistory(data);
  }

  async getTimezoneList() {
    return this.countryRepository.getTimezoneList();
  }

  async getLocaleList() {
    return this.countryRepository.getLocaleList();
  }
}
