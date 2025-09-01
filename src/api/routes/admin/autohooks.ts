import { FastifyPluginAsync } from 'fastify';
import { adminHook } from 'src/api/hooks/admin.hook';

const adminAutoHooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', adminHook);
};

export default adminAutoHooks;
