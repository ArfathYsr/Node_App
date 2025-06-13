import { Response, NextFunction } from 'express';

import container from '../dependencyManager/inversify.config';
import ProfileRepository from '../profile/repositories/profileRepository';
import TYPES from '../dependencyManager/types';
import { CustomRequest } from '../types/express';

// Middleware to authorize roles
const roleMiddleware = (roles: string[]) => {
  const requiredRoles = roles.map((value) => value.toLowerCase());
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Check if the profile is activated
    const profileRepository = container.get<ProfileRepository>(
      TYPES.ProfileRepository,
    );

    try {
      const profile = await profileRepository.findProfileByIdWithRole(
        req.docUser!.profileId,
      );

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
      const { profileRole } = profile;
      const usersRoleExist = profileRole.filter((role) =>
        requiredRoles.includes(role.name.toLowerCase()),
      );
      if (!usersRoleExist.length) {
        return res
          .status(403)
          .json({ message: 'Access Denied. Insufficient permissions.' });
      }
      const roleArray = usersRoleExist.map((item) => item.name);
      req.userRole = roleArray;
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

export default roleMiddleware;
