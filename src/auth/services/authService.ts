import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import AuthHandler from '../../libs/authHandler';
import logger from '../../libs/logger';
import { sessionStore } from '../../middlewares/sessionMiddleware';

@injectable()
export default class AuthService {
  constructor(
    @inject(TYPES.AuthHandler) private readonly authHandler: AuthHandler,
  ) {}

  async getUserInfo(user) {
    return {
      data: user.userinfo,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
    };
  }

  async revokeAllTokens(accessToken, refreshToken) {
    const accessTokenRevoke = await this.authHandler.revoke(
      accessToken,
      'access_token',
    );
    const refreshTokenRevoke = await this.authHandler.revoke(
      refreshToken,
      'refresh_token',
    );

    return {
      acc: accessTokenRevoke,
      refr: refreshTokenRevoke,
    };
  }

  async logout(sessionID: string) {
    return new Promise<void>((resolve, reject) => {
      sessionStore.destroy(sessionID, (err) => {
        if (err) {
          logger.error(err);
          reject(err instanceof Error ? err : new Error(String(err)));
        }
        resolve();
      });
    });
  }
}
