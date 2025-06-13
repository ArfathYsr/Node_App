import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import AuthService from '../services/authService';
import logger from '../../libs/logger';

interface CustomRequest extends Request {
  docUser?: any;
}
@injectable()
export default class AuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService,
  ) {
    this.logout = this.logout.bind(this);
  }

  async getUserData(req: CustomRequest, res: Response) {
    const { docUser } = req;

    res.json(docUser);
  }

  async revoke(req, res) {
    const { accessToken } = req.user;
    const { refreshToken } = req.user;
    try {
      const result = await this.authService.revokeAllTokens(
        accessToken,
        refreshToken,
      );

      res.json(result);
    } catch (error) {
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'Internal server error', error });
    }
  }

  async logout(req: CustomRequest, res: Response) {
    try {
      const { sessionID } = req.docUser;
      await this.authService.logout(sessionID);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: 'Internal server error', error });
    }
    res.status(HttpStatusCode.Ok).json({ message: 'User logout successfully' });
  }

  /*   async introspect(req: Request, res: Response) {
    return this.authService.introspect(req, res);
  } */
}
