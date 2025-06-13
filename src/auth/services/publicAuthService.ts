import { inject, injectable } from 'inversify';
import config from 'config';
import TYPES from '../../dependencyManager/types';
import AuthHandler from '../../libs/authHandler';

@injectable()
export default class PublicAuthService {
  constructor(
    @inject(TYPES.AuthHandler) private readonly authHandler: AuthHandler,
  ) {}

  async authenticate(req, res, next) {
    return this.authHandler.authenticate(req, res, next, {
      state: JSON.stringify(req.query),
    });
  }

  async callbackAuthenticate(req, res, next) {
    return this.authHandler.authenticate(req, res, next, {
      successRedirect: config.get<string>('auth.redirectUrls.home'),
      failureRedirect: config.get<string>('auth.redirectUrls.error'),
    });
  }
}
