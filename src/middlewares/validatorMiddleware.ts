import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validatorMiddleware =
  (schema: z.Schema<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };

export default validatorMiddleware;
