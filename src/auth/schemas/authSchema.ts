import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const LoginSchema = z
  .object({
    email: z.string().email().openapi({ example: 'test@gmail.com' }),
    password: z.string().openapi({ example: '1212121' }),
  })
  .openapi('Login');

export const UserDataSchema = z
  .object({
    data: z
      .object({
        sub: z.string().email().openapi({ example: 'john.doe@iqvia.com' }),
        upn: z.string().email().openapi({ example: 'john.doe@iqvia.com' }),
        loginid: z.string().email().openapi({ example: 'john.doe@iqvia.com' }),
        idpid: z.string().openapi({ example: 'AzureB2EOpenID' }),
        domain: z.string().openapi({ example: 'quintiles.net' }),
        name: z.string().openapi({ example: 'Doe, John EX1' }),
        groups: z.string().openapi({
          example:
            'WWiFlex-A-DCCA2,WWIDM-A-ELVISPRD,WWARS-JResnickReportingNoCanada,...',
        }),
        given_name: z.string().openapi({ example: 'John' }),
        family_name: z.string().openapi({ example: 'Doe' }),
        b2c_idp: z.string().openapi({ example: 'false' }),
        userid: z.string().openapi({ example: 'u1111111' }),
        email: z.string().email().openapi({ example: 'john.doe@iqvia.com' }),
      })
      .openapi('UserInfo'),
    accessToken: z
      .string()
      .openapi({ example: 'c191b9c5-3641-34c0-b2fd-0a14872f52b9' }),
    refreshToken: z
      .string()
      .openapi({ example: '18c81322-d385-376f-83ae-5b7f1ca18a02' }),
    idToken: z.string().openapi({
      example:
        'eyJ4NXQiOiJOelZrTWprME9EUm1PVE0wWm1Kak5qTTNOV017T1dReU5EQmpOR1U1WkdNMU5EYzNOemM0WW1Jek5URXlaalk1WVRnM1pUQTVNRGcwWVRSaU4yWmhaQSIsImtpZCI6Ik56VmtNamswT0RSbU9UTTBabUpqTmpNM05XTXpPV1F5TkRCak5HVTVaR00xTkRjM056YzRZbUl6TlRFeVpqWTVZVGczWlRBNU1EZzBZVFJpTjJaaFpBX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiZmhjb3VSRnlvVHdWbWQ0b0kxdjdIdyIsInN1YiI6InBhdmxvLmhvcmJhY2hAaXF2aWEuY29tIiwibG9naW5pZCI6InBhdmxvLmhvcmJhY2hAaXF2aWEuY29tIiwiaWRwaWQiOiJBenVyZUIyRU9wZW5JRCIsImFtciI6WyJPcGVuSURDb25uZWN0QXV0aGVudGljYXRvciIsIklkZW50aWZpZXJFeGVjdXRvciJdLCJpc3MiOiJodHRwczpcL1wvZGV2Mi1mZWRzdmMuc29sdXRpb25zLmlxdmlhLmNvbTo0NDNcL29hdXRoMlwvdG9rZW4iLCJncm91cHMiOlsiV1dpRmxleC1BLURDQ0EyIiwiV1dJRE0tQS1FTFZJU1BSRCIsIldXQVJTLUpSZXNuaWNrUmVwb3J0aW5nTm9DYW5hZGEiLCJHbG9iYWwgU2VjdXJpdHkiLCJXV0JJLUEtUHJvamVjdCBNYW5hZ2VtZW50IFJlcG9ydHMgQ1YiLCJXV0JJLUEtU1NVIERhc2hib2FyZCB2MiBSZXBvcnRzIENWIiwiV1dRWk9ORS1BLVFaT05FVXNlcnMiLCJXV0JJLUEtQVRQIHYyLjAgQ29nbm9zIFZpZXdlcnMgUHJvZCIsIldXTzM2NS1hLVlhbW1lclVzZXJzIiwiV1dJRE0tQS1FTFZJU1Rlc3QiLCJ3d3ZhZC1hLVBCQUFTLUNsb3VkLUV1cm9wZSIsIldXQkktQS1FREMgTWV0cmljcyBDb2dub3MgVmlld2VycyIsIlVTQlRQMi1TRy1DVUdQTyIsIklRVklBIC0gQ2xvdWQgQXV0aGVudGljYXRpb24gRHluYW1pYyIsIldXRmxleERlc2stQS1BREMiLCJXV0JJLUEtSVBEIFJlcG9ydHMgQ29nbm9zIFZpZXdlcnMiLCJBUlMtRHluYW1pYy1NRkEtTmV3SGlyZSIsIldXQkktQS1HT0ggQ29nbm9zIFZpZXdlcnMiLCJXV1RFU1QtR2xvYmFsU2VjdXJpdHkiLCJXV0JJLUEtQ0kgUHVibGljIEZvbGRlcnMiLCJBUlMtRHluYW1pYy1DbG91ZEF1dGhlbnRpY2F0aW9uLU5ld0hpcmUiLCJXV0JJLUEtU1NVIE9wZXJhdGlvbnMgQ29nbm9zIFZpZXdlcnMiLCJXV0JJLUEtQ0kgQ29nbm9zIFZpZXdlcnMiLCJXV0JJLUEtUHJvamVjdCBSZXBvcnRzIENvZ25vcyBWaWV3ZXIiLCJXV0lETS1BLUVMVklTUFJELVRlc3QzIiwiUGluU2FmZSBVc2VycyIsIldXQkktQS1OZXcgU1NVIERhc2hib2FyZCBSZXBvcnRzIENWIiwiV1dJRE0tQS1FTFZJU1Rlc3QyIl0sImdpdmVuX25hbWUiOiJQYXZsbyIsInVzZXJpZCI6InUxMTgzODM0Iiwic2lkIjoiMTA3ODcwMGUtNWFjOC00MmUwLWJkZGUtYWY4ZWQ5Y2MyN2U4IiwiYXVkIjoiSl9YZmRLSDg2aGEwZHBTanI0YXFJWFVHWmxvYSIsImNfaGFzaCI6IlBxbkxlcVNvb2l2MDhmUVNnUi1MN0EiLCJ1cG4iOiJwYXZsby5ob3JiYWNoQGlxdmlhLmNvbSIsIm5iZiI6MTcyMjg2OTkxMSwiYXpwIjoiSl9YZmRLSDg2aGEwZHBTanI0YXFJWFVHWmxvYSIsImRvbWFpbiI6InF1aW50aWxlcy5uZXQiLCJuYW1lIjpbIkhvcmJhY2giLCIgUGF2bG8gRVgxIl0sImV4cCI6MTcyMjg3MzUxMSwiaWF0IjoxNzIyODY5OTExLCJNdWx0aUF0dHJpYnV0ZVNlcGFyYXRvciI6W10sImZhbWlseV9uYW1lIjoiSG9yYmFjaCIsImIyY19pZHAiOiJmYWxzZSIsImVtYWlsIjoicGF2bG8uaG9yYmFjaEBpcXZpYS5jb20ifQ.PGE0eVoCUlctb0dCnXu-UxEpURNrIkc2Cxi1be9U6bBQopkOng9Ewh-fu1YMSJE4umwB3Ixuvrp0I_WN-uwnsIuG3gxYc1UntiR6YTCn7jwWdjowVWaqrxL13Jr2R-ZieKh8JVfsQSf4A0Xkp7rpyMrDtYZiSBttDBgitL-14JVwsCTMTFOFURix-Ebzb-ptoql8JXc3CS8-8qDO6ykLSlfkBIjkuGqpWt34i47GAZ18qeE4QE92ETiiqwBFFYzuzP2VkekmFNy9M07zLa_fFsKsBAalj1X08s6-JhJNq_tRdyBOXKCr-GZ86NRvkrkPUioUBzlH5FMvUgktRLOPww',
    }),
  })
  .openapi('UserData');

export const TokenRevocationSchema = z.object({}).openapi('EmptyObject');

export const CallbackQuerySchema = z.object({
  code: z.string().openapi({ example: '6b6572bb-cae9-3b55-8002-d596db0dcd94' }),
  state: z
    .string()
    .openapi({ example: 'OEJljHbmzUoxDkbB7nx2BIxIoDRJaZHQuy_3YXrJ0Bs' }),
  session_state: z.string().openapi({
    example:
      '512b457eb779369d8f9f89f20f548998c36d8d33b126587af549546c04ff4bad.Nu2Ye7pAymF1on5rjTEnQg',
  }),
});
