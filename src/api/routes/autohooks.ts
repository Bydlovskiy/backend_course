import { FastifyPluginAsync } from 'fastify';
import { authHook } from '../hooks/auth.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', authHook);
};

export default hooks;