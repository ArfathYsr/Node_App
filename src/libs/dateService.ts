import { injectable } from 'inversify';
import { DateTime } from 'luxon';

@injectable()
export default class DateService {
  timezoneOffset: number = 0;

  timezone: string = 'UTC';

  getProcessTimezoneOffset() {
    return DateTime.local().offset;
  }

  getTodaysStartAndEndDates(config?: {
    timezone?: string;
  }): [DateTime, DateTime] {
    const today: DateTime = DateTime.local({
      zone: config?.timezone ?? this.timezone,
    });
    const dayStartDate: DateTime = today.startOf('day');
    const dayEndDate: DateTime = today.endOf('day');

    return [dayStartDate, dayEndDate];
  }
}
