import { Request, Response, NextFunction } from 'express';
import { Profile } from '@models/index';
import cacheClient from '@config/cache';

/**
 * Middleware to Add User Profile ( Client / Contractor) into the request.
 */
const addUserProfile = async (request: Request, response: Response, next: NextFunction) => {
    const profileId = request.get('profile_id') || "0";
    let userProfile = cacheClient.get(profileId);

    if (!userProfile) {
        userProfile = await Profile.findOne({ where: { id: profileId } });
        userProfile && cacheClient.set(profileId, userProfile, 2000);
    }

    if (!userProfile) {
        response.status(401).json({ message: "Authorization Failed." })
    }

    // Adding Current User Profile to Request context
    request.context.user = userProfile

    next()
}


export { addUserProfile }