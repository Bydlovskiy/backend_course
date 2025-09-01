import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const adminHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.routeOptions.config.skipAuth) {
    return;
  }

  const profile = request.profile;
  if (!profile) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (profile.role !== 'admin') {
    throw new HttpError(403, 'Forbidden: admin role required');
  }
};
