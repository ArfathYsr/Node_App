import config from 'config';

const defaultEndDate: Date = new Date(
  config.get<string>('defaultEntity.defaultEndDate'),
);
interface EntityStatusDto {
  startDate?: Date;
  endDate?: Date;
}

function validateDates(dto: EntityStatusDto): Date {
  const { startDate, endDate } = dto;

  if (
    (endDate && !startDate) ||
    (startDate && endDate && endDate < startDate)
  ) {
    throw new Error('EndDate should be later than StartDate');
  }

  const finalEndDate = endDate || defaultEndDate;
  return finalEndDate;
}
export default validateDates;
