import { ResponseConfig } from '@asteasolutions/zod-to-openapi';

type ResponseType = {
  [statusCode: string]: ResponseConfig;
};

const defaultResponses: ResponseType = {
  500: {
    description: 'Server Error',
  },
  404: {
    description: 'Not found',
  },
  401: {
    description: 'Unauthorized',
  },
};

type AvailableDefaultStatusCodes = keyof typeof defaultResponses;

export const getDefaultDocsResponses = (
  includedStatusCodes: AvailableDefaultStatusCodes[],
) => {
  const resultingDefaultDocs: ResponseType = {};

  includedStatusCodes.forEach((statusCode) => {
    resultingDefaultDocs[statusCode] = defaultResponses[statusCode];
  });

  return resultingDefaultDocs;
};
