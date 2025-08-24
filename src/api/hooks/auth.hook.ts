// import { preHandlerAsyncHookHandler } from 'fastify';
// import { HttpError } from '../errors/HttpError';
// import { identityService } from 'src/services/aws/cognito/cognito.service';

// const TOKEN_HEADER_NAME = 'Authorization';

// export const authHook: preHandlerAsyncHookHandler = async function (request) {  
//   try {
//     const token = (request.headers[TOKEN_HEADER_NAME] || request.headers[TOKEN_HEADER_NAME.toLowerCase()]) as string;
//     if (!token) {
//       throw new Error('No token');
//     }
    
//     // eslint-disable-next-line no-useless-escape
//     const bearerTokenMatch = token.match(/Bearer\s+([A-Za-z0-9-._~+\/]+=*)$/);
//     if (!bearerTokenMatch) {
//       throw new Error('Token in wrong format');
//     }

//     const [, bearerToken] = bearerTokenMatch;
//     const identityUser = await identityService.getUserByAccessToken(bearerToken);
    
//     const profile = await this.repos.profileRepo.findByCognitoSub(identityUser.subId);
//     if (!profile) {
//       throw new Error('No profile');
//     }

//     request.log = request.log.child({ 
//       identityUser,
//       profile
//     });

//     request.identityUser = identityUser;
//     request.profile = profile;
//   } catch (err) {
//     throw new HttpError(401, 'Auth err', err);
//   }
// };