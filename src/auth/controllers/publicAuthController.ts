import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import PublicAuthService from '../services/publicAuthService';

@injectable()
export default class PublicAuthController {
  constructor(
    @inject(TYPES.PublicAuthService)
    private readonly publicAuthService: PublicAuthService,
  ) {}

  async authenticate(req: Request, res: Response, next: NextFunction) {
    return this.publicAuthService.authenticate(req, res, next);
  }

  async callbackAuthenticate(req: Request, res: Response, next: NextFunction) {
    return this.publicAuthService.callbackAuthenticate(req, res, next);
  }
}
