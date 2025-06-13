import cookieParser from 'cookie-parser';
import { RequestHandler } from 'express';
import config from 'config';

const COOKIES_SECRET = config.get<string>('cookie.cookieSecret');
const cookieMiddleware: RequestHandler = (req, res, next) => {
  cookieParser(COOKIES_SECRET)(req, res, next);
};

export default cookieMiddleware;
