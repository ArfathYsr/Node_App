import { config as loadEnv } from 'dotenv';

loadEnv();

function extractDatabaseName(databaseUrl: string): string | null {
  const match = databaseUrl.match(/database=([^;]+)/);
  return match ? match[1] : null;
}

const config = {
  port: parseInt(process.env.PORT || '3005', 10),
  timeoutAxios: parseInt('10000', 10),
  sizeRequestLimit: process.env.SIZE_REQUEST_LIMIT || '20kb',
  dataBaseUrl: process.env.DATABASE_URL,
  dataBase: extractDatabaseName(process.env.DATABASE_URL!),

  openApi: {
    openapi: '3.0.0',
    info: {
      version: process.env.OPENAPI_INFO_VERSION,
      title: process.env.OPENAPI_INFO_TITLE,
      description: process.env.OPENAPI_INFO_DESCRIPTION,
    },
    servers: [
      {
        url: process.env.OPENAPI_SERVERS_URL,
      },
    ],
    swagger: {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  },
  cookie: {
    cookieSecret: process.env.COOKIE_SECRET || 'super cookie secret',
    cookieSecure: process.env.COOKIE_SECURE,
    cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE || '3600000', 10),
  },

  auth: {
    discoveryEndpoint: process.env.DISCOVERY_ENDPOINT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUris: process.env.REDIRECT_URIS,
    postLogoutRedirectUris: process.env.POST_LOGOUT_REDIRECT_URIS,
    tokenEndpointAuthMethod: process.env.TOKEN_ENDPOINT_AUTH_METHOD,

    redirectUrls: {
      home: process.env.REDIRECT_HOME,
      error: process.env.REDIRECT_ERROR,
    },

    session: {
      sessionConfigSecret: process.env.SESSION_CONFIG_SECRET,
      sessionConfigResave: process.env.SESSION_CONFIG_RESAVE,
      sessionConfigSaveUninitialized:
        process.env.SESSION_CONFIG_SAVE_UNINITIALIZED,
      redisUrl: process.env.REDIS_URL,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    internalSsoDomains: process.env.INTERNAL_SSO_DOMAINS || 'quintiles.net',
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || [],
  },
  aws: {
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    s3Url: process.env.S3_URL,
    s3BucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION,
  },
  defaultEntity: {
    defaultEndDate: process.env.DEFAULT_ENTITY_END_DATE,
    clientServerBaseUrl:
      process.env.CLIENT_SERVER_BASE_URL || 'http://localhost:4001',
  },
  childClientSeviceUrl: process.env.CHILD_CLIENT_SERVICE_URL,
};

export default config;
