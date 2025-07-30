import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const HEADER_NAME = 'x-request-id';

const plugin: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header(HEADER_NAME, request.id);
  });
};

export default fp(plugin, '5.x');