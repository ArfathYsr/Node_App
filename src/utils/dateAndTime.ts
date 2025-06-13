const convertUTCToDateWithoutTime = (utcDate: string | Date): string => {
  const date = new Date(utcDate);
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

function dateValidation(sDate: string | Date, eDate: string | Date): boolean {
  const startDate = convertUTCToDateWithoutTime(sDate);
  const endDate = convertUTCToDateWithoutTime(eDate);
  if (startDate > endDate) return false;
  return true;
}

function isEndDateAfterToday(eDate: string | Date): boolean {
  const today = convertUTCToDateWithoutTime(new Date());
  const endDate = convertUTCToDateWithoutTime(new Date(eDate));
  return endDate >= today;
}

export { convertUTCToDateWithoutTime, dateValidation, isEndDateAfterToday };
