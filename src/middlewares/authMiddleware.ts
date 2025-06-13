import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import { COMMON } from '../utils/common';
import { sessionStore } from './sessionMiddleware';
import TokenService from '../libs/tokenService';
import ProfileRepository from '../profile/repositories/profileRepository';
import TYPES from '../dependencyManager/types';
import container from '../dependencyManager/inversify.config';
import CommonRepository from '../common/repositories/commonRepository';

interface CustomRequest extends Request {
  docUser?: any;
}

async function getSession(sessionID: string): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionStore.get(sessionID, (err, session) => {
      if (err || !session) {
        reject(new Error('Session not found or expired'));
      } else {
        resolve(session);
      }
    });
  });
}

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    // Verify and decode the token
    const decoded = TokenService.verifyToken(token);

    req.user = decoded;

    const { sessionID } = decoded as { sessionID: string };
    const { employeeId } = decoded as { employeeId: string };

    if (!sessionID) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: 'Unauthorized: No session ID provided' });
    }

    // Check sessionId in Redis
    const session = await getSession(sessionID);

    // Check if the profile is activated
    const profileRepository = container.get<ProfileRepository>(
      TYPES.ProfileRepository,
    );
    const commonRepository = container.get<CommonRepository>(
      TYPES.CommonRepository,
    );
    const profile = await profileRepository.findProfileByIdentityId(employeeId);

    const statusId: number = await commonRepository.getStatusId(
      COMMON.STATUS.ACTIVE,
    );
    if (!profile || profile.profileStatusId !== statusId) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: 'Profile is not activated' });
    }

    const profileId = profile.id;
    req.docUser = { user: session.passport.user, sessionID, profileId };

    next();
  } catch (err) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
