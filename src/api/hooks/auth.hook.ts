import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';
import { EErrorCodes } from '../errors/EErrorCodes';

const TOKEN_HEADER_NAME = 'Authorization';

export const authHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.routeOptions.config.skipAuth) {
    return;
  }
  
  try {
    const token = (request.headers[TOKEN_HEADER_NAME] 
      || request.headers[TOKEN_HEADER_NAME.toLowerCase()]) as string;
      
    if (!token) {
      throw new Error('No token');
    }

    const bearerTokenMatch = token.match(/Bearer\s+([A-Za-z0-9-._~+/]+=*)$/);
    if (!bearerTokenMatch) {
      throw new Error('Token in wrong format');
    }

    const [, bearerToken] = bearerTokenMatch;
    const identityUser = await this.identityService.getUserByAccessToken(bearerToken);

    if (identityUser?.isEnabled === false) {
      throw new HttpError(403, 'User is disabled', undefined, EErrorCodes.USER_DISABLED);
    }

    const profile = await this.repos.profileRepo.findByCognitoSub(identityUser.subId);
    if (!profile) {
      throw new Error('No profile');
    }

    request.log = request.log.child({
      identityUser,
      profile
    });

    request.identityUser = identityUser;
    request.profile = profile;
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(401, 'Unauthorized', err);
  }
};