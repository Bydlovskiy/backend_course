import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';
import { identityService } from 'src/services/aws/cognito/cognito.service';

const TOKEN_HEADER_NAME = 'authorization';

export const authHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.routeOptions.config.skipAuth) {
    return;
  }

  try {
    const tokenHeader = request.headers[TOKEN_HEADER_NAME] as string | undefined;

    if (!tokenHeader) {
      throw new Error('No token');
    }

    const bearerTokenMatch = tokenHeader.match(/Bearer\s+([A-Za-z0-9-._~+/]+=*)$/);
    if (!bearerTokenMatch) {
      throw new Error('Token in wrong format');
    }

    const [, bearerToken] = bearerTokenMatch;
    const identityUser = await identityService.getUserByAccessToken(bearerToken);

    const profile = await (request as any).repos.profileRepo.findByCognitoSub(identityUser.subId);
    if (!profile) {
      throw new Error('No profile');
    }

    request.log = request.log.child({
      identityUserSub: identityUser.subId,
      profileId: profile.id
    });

    request.identityUser = identityUser;
    request.profile = profile;
  } catch (err) {
    throw new HttpError(401, 'Unauthorized', err);
  }
};