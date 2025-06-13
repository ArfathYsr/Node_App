import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import RepositoryError from '../error/repositoryError';
import { convertUTCToDateWithoutTime } from './dateAndTime';
import { BadRequestError } from '../error/badRequestError';
import { COMMON } from './common';
import { MESSAGES } from './message';
import { REGEXP } from './regExp';
import { ERRORMESSAGE } from './errorMessage';

interface PreparedImageData {
  key: string;
  imageBuffer: Buffer;
  contentType: string;
}

const getProfileName = (profile) => {
  return profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
      }
    : null;
};

const getEmailInfo = (profileEmails) =>
  profileEmails.length > 0
    ? {
        id: profileEmails[0].id,
        isActive: profileEmails[0].isActive,
        emailAddress: profileEmails[0].emailAddress,
        emailAddressTypeId: profileEmails[0].emailAddressTypeId,
        correspondance: profileEmails[0].correspondance,
      }
    : null;

const getPhoneInfo = (profilePhones) =>
  profilePhones.length > 0
    ? {
        id: profilePhones[0].id,
        isActive: profilePhones[0].isActive,
        countryCode: profilePhones[0].countryCode,
        phoneNumber: profilePhones[0].phoneNumber,
        phoneTypeId: profilePhones[0].phoneTypeId,
        correspondance: profilePhones[0].correspondance,
      }
    : null;

const getRoleInfo = (profileRole) => {
  const currentDate = new Date();

  return profileRole.map(({ role }) => ({
    id: role.id,
    isActive: role.endDate ? new Date(role.endDate) >= currentDate : false,
    name: role.name,
    description: role.description,
    isExternal: role.isExternal,
  }));
};

const getFunctionAreaInfo = (profileFunctionalArea) => {
  const currentDate = new Date();
  return profileFunctionalArea.map(({ functionalArea }) => ({
    id: functionalArea.id,
    isActive: functionalArea.endDate
      ? new Date(functionalArea.endDate) >= currentDate
      : false,
    name: functionalArea.name,
    description: functionalArea.description,
    isExternal: functionalArea.isExternal,
  }));
};

const extractRoleIdsFromProfileRoles = (profileRoles) => {
  if (!profileRoles) {
    return [];
  }
  return profileRoles.map(({ roleId }) => roleId);
};

const getActiveStatusBasedOnStartDateAndEndDate = (startDate, endDate) => {
  const today = new Date(convertUTCToDateWithoutTime(new Date()));
  const isActive: boolean =
    (!startDate && !endDate) ||
    (startDate &&
      !endDate &&
      today >= new Date(convertUTCToDateWithoutTime(startDate))) ||
    (!startDate &&
      endDate &&
      today <= new Date(convertUTCToDateWithoutTime(endDate))) ||
    (startDate &&
      endDate &&
      today >= new Date(convertUTCToDateWithoutTime(startDate)) &&
      today <= new Date(convertUTCToDateWithoutTime(endDate)));
  return isActive;
};

const validateHeadersAndData = (data: any[], requiredHeaders: any[]): void => {
  if (data.length === 0) {
    throw new BadRequestError('The file is empty.');
  }
  const headers = Object.keys(data[0]);
  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header),
  );

  if (missingHeaders.length > 0) {
    throw new BadRequestError(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  data.forEach((row, index) => {
    if (!row.firstName) {
      throw new BadRequestError(`firstName is required in row ${index + 1}`);
    }
    if (!row.lastName) {
      throw new BadRequestError(`lastName is required in row ${index + 1}`);
    }
    if (!row.email || !/^\S+@\S+\.\S+$/.test(row.email)) {
      throw new BadRequestError(`Invalid email address in row ${index + 1}`);
    }
    if (!row.functionalArea) {
      throw new BadRequestError(`functionalArea is required in row ${index + 1}`);
    }
    if (!row.role) {
      throw new BadRequestError(`role is required in row ${index + 1}`);
    }
    if (!row.permission) {
      throw new BadRequestError(`permission is required in row ${index + 1}`);
    }
    if (!row.permissionGroup) {
      throw new BadRequestError(`permissionGroup is required in row ${index + 1}`);
    }
  });
}

const processFile = (
  fileBuffer: Buffer,
  fileType: string,
  requiredHeaders: any[],
): any[] => {
  let parsedData: any[];
  if (fileType === 'text/csv') {
    parsedData = parse(fileBuffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    parsedData = XLSX.utils.sheet_to_json(worksheet);
  } else {
    throw new BadRequestError(
      'Unsupported file type. Only CSV and Excel files are allowed.',
    );
  }

  validateHeadersAndData(parsedData, requiredHeaders);
  return parsedData;
};

const getIdsFromObjects = (arr) => {
  return arr.map((obj) => obj.id);
};

// The function checkIfExistsInBoth takes two arrays as arguments and checks if any element from the first array exists in the second array - [ return true/false]
const checkIfExistsInBoth = (arr1, arr2) => {
  return arr1.some((id) => arr2.includes(id));
};

const buildArchivedFilter = (isArchived: number) => {
  if (isArchived === 2) {
    return { archivedAt: { not: null } };
  }
  if (isArchived === 1) {
    return { archivedAt: {} };
  }
  return {};
};

const rawQuerybuildArchivedFilter = (isArchived: number) => {
  if (
    isArchived &&
    isArchived !== COMMON.SHOW_ALL_ARCHIVED &&
    isArchived !== COMMON.INCLUDE_ARCHIVED_RECORDS
  ) {
    throw new BadRequestError(MESSAGES.INVALID_ARCHIVED_FILTER_VALUE);
  }
  if (isArchived === 2) {
    return { whereClause: 'ArchivedAt IS NOT NULL' };
  }
  if (isArchived === 1) {
    return { whereClause: '' };
  }
  return { whereClause: 'ArchivedAt IS NULL' };
};

// common function to validate Active or Valid / invalid Id's
/**
 * Validates the provided IDs by checking if they exist in the active records.
 * @param ids - Array of IDs to validate.
 * @param findActiveByIds - Function to find active records by IDs.
 * @param errorMessage - Function to generate an error message for invalid IDs.
 */
async function validateIds(
  ids: number[],
  findActiveByIds: (ids: number[]) => Promise<{ id: number }[]>,
  errorMessage: (invalidIds: number[]) => string,
) {
  if (ids && ids.length > 0) {
    const existingIds: { id: number }[] = await findActiveByIds(ids);
    const validIdsSet: Set<number> = new Set(
      existingIds.map((item) => item.id),
    );
    const invalidIds: number[] = [];

    ids.forEach((id) => {
      if (!validIdsSet.has(id)) {
        invalidIds.push(id);
      }
    });

    if (invalidIds.length > 0) {
      throw new BadRequestError(errorMessage(invalidIds));
    }
  }
}


export function repositoryError(err: unknown): never {
  const error = err as Error;
  throw new RepositoryError(
    `Repository Error: ${error.message || 'Unknown error'}`,
  );
}

const getStatus = (startDate, endDate) => {
  const today = new Date(convertUTCToDateWithoutTime(new Date()));

  let statusString: string = COMMON.STATUS.INACTIVE;

  if (!startDate && !endDate) {
    statusString = COMMON.STATUS.INACTIVE;
  } else if (
    startDate &&
    !endDate &&
    today >= new Date(convertUTCToDateWithoutTime(startDate))
  ) {
    statusString = COMMON.STATUS.ACTIVE;
  } else if (
    !startDate &&
    endDate &&
    today <= new Date(convertUTCToDateWithoutTime(endDate))
  ) {
    statusString = COMMON.STATUS.ACTIVE;
  } else if (
    startDate &&
    endDate &&
    today >= new Date(convertUTCToDateWithoutTime(startDate)) &&
    today <= new Date(convertUTCToDateWithoutTime(endDate))
  ) {
    statusString = COMMON.STATUS.ACTIVE;
  }
  return statusString;
};
const prepareImageData = (
  logo: string,
  fileName: string,
  basePath: string,
): PreparedImageData => {
  const regex: RegExp = REGEXP.BASE64IMG;
  const match: RegExpExecArray | null = regex.exec(logo);

  if (!match) {
    throw new Error(ERRORMESSAGE.INVALID_IMAGE_FORMAT);
  }

  const imageFormat: string = match[1];
  const contentType: string = `${COMMON.IMGPATH}${imageFormat}`;
  const timestamp: number = Date.now();
  const sanitizedContentName: string = fileName?.replace(REGEXP.REPLACE, '_');
  const key: string = `${basePath}${sanitizedContentName}_${timestamp}.${imageFormat?.split('+')[0]}`;
  const encoding: BufferEncoding = COMMON.ENCODEING as BufferEncoding;
  const imageData: string = logo?.replace(REGEXP.BASE64IMG, '');
  const imageBuffer: Buffer = Buffer.from(imageData, encoding);
  return { key, imageBuffer, contentType };
};
export {
  getProfileName,
  getEmailInfo,
  getPhoneInfo,
  getRoleInfo,
  getFunctionAreaInfo,
  extractRoleIdsFromProfileRoles,
  getActiveStatusBasedOnStartDateAndEndDate,
  getIdsFromObjects,
  checkIfExistsInBoth,
  processFile,
  buildArchivedFilter,
  rawQuerybuildArchivedFilter,
  getStatus,
  validateIds,
  prepareImageData,
};
