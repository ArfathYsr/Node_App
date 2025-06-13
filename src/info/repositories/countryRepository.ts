import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';

@injectable()
class CountryRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async countryList() {
    return this.prisma.country.findMany();
  }

  async getTimezoneList() {
    return this.prisma.timeZone.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getLocaleList() {
    return this.prisma.locale.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}

export default CountryRepository;
