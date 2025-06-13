import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import config from 'config';
import { UserDataSchema, CallbackQuerySchema } from './authSchema';

// Define Authorization Route
export const getAuth: RouteConfig = {
  method: 'get',
  path: '/api/v1/auth',
  tags: ['Authorization Public'],
  summary: 'Process authorization flow',
  responses: {
    302: {
      description: 'Redirects to the IQVIA authorization page.',
      headers: {
        Location: {
          description: `Redirect URL to the IQVIA authorization page. After authentication, it redirects to /auth/callback`,
          schema: {
            type: 'string',
            example: 'https://dev2-fedsvc.solutions.iqvia.com/oauth2/authorize',
          },
        },
      },
    },
  },
};

// Define Callback Route
export const getAuthCallback: RouteConfig = {
  method: 'get',
  path: '/api/v1/auth/callback',
  tags: ['Authorization Public'],
  summary: 'Accepts a callback with parameters from SSO provider',
  request: {
    query: CallbackQuerySchema,
  },
  responses: {
    302: {
      description: `Redirects to ${config.get<string>('auth.redirectUrls.home')}get?token=jwtoken on success, or to ${config.get<string>('auth.redirectUrls.error')} in case of failure.`,
      headers: {
        Location: {
          description: 'Redirect URL',
          schema: {
            type: 'string',
            example: 'https://domain.com/auth/home',
          },
        },
      },
    },
  },
};

// Define Home Route
export const getAuthHome: RouteConfig = {
  method: 'get',
  path: '/api/v1/auth/home',
  summary: 'Returns whole user data',
  deprecated: true,
  tags: ['Authorization'],
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      required: true,
      description:
        'JWT token required for authentication. Should be provided as "Bearer <token>".',
      schema: {
        type: 'string',
        example: 'Bearer example_jwt_token',
      },
    },
  ],
  responses: {
    200: {
      description: 'Successfully retrieved user data.',
      content: {
        'application/json': {
          schema: UserDataSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized.',
    },
  },
};

// Define Logout Route
export const getAuthLogout: RouteConfig = {
  method: 'get',
  path: '/api/v1/auth/logout',
  summary: 'Logout',
  tags: ['Authorization'],
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      required: true,
      description:
        'JWT token required for authentication. Format: Bearer <token>',
      schema: {
        type: 'string',
        example: 'Bearer example_jwt_token_value',
      },
    },
  ],
  responses: {
    200: {
      description: 'User logout successfully',
      content: {
        'text/plain': {
          schema: {
            type: 'string',
            example: 'User logout successfully',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized.',
    },
  },
};

export default { getAuth, getAuthHome, getAuthCallback, getAuthLogout };
