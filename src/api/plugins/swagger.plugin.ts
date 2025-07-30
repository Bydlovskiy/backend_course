import { FastifyInstance } from 'fastify';
import fastifyBasicAuth from '@fastify/basic-auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { EErrorCodes, getErrorCodesDescription } from '../errors/EErrorCodes';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function setupSwagger(server: FastifyInstance, userName: string, pwd: string) {
  await server.register(fastifyBasicAuth, {
    validate(u, p, _req, _reply, done) {
      if (u === userName && pwd === p) {
        done();
      } else {
        done(new Error('Unauthorized'));
      }
    },
    authenticate: true
  });
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'fastify-boilerplate',
        description: 'fastify-boilerplate',
        version: '1.0.0'
      },
      servers: [],
      security: [{ auth: [] }],
      components: {
        securitySchemes: {
          auth: {
            description: 'Authorization header token, sample: "Bearer {TOKEN}"',
            type: 'apiKey',
            name: 'authorization',
            in: 'header'
          }
        },
        schemas: {
          ErrorCodes: {
            type: 'integer',
            enum: Object.values(EErrorCodes).filter((value) => typeof value === 'number'),
            description: getErrorCodesDescription()
          }
        }
      }
    },
    transform: jsonSchemaTransform
  });
  await server.register(fastifySwaggerUI, {
    routePrefix: '/api/documentation',
    logLevel: 'silent',
    uiHooks: {
      onRequest: server.basicAuth
    }
  });
}