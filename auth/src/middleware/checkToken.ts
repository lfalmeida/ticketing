import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../errors/badRequestError';
import { UserPayload } from '../interfaces/user';
import { TokenService } from '../services/tokenService';

/**
 * Define currentUser proterty into Express Request interface
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const checkToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(' ')[1];
  }

  const jwtInsideCookie = req.session?.token;
  if (jwtInsideCookie) {
    token = jwtInsideCookie;
  }

  if (token) {
    const payload = TokenService.verify(token);
    req.currentUser = payload;
    return next();
  }

  throw new BadRequestError('Token not povided.');
}