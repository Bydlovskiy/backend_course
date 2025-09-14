import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { sendInvite } from 'src/controllers/invite/send-invite';
// import { acceptInvite } from 'src/controllers/invite/accept-invite';
// import { AcceptInviteReqSchema } from '../../schemas/invite/AcceptInviteReqSchema';
import { resendInvite } from 'src/controllers/invite/resend-invite';
import { adminHook } from 'src/api/hooks/admin.hook';
import { ERole } from 'src/types/profile/Role';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
    fastify.post('/', {
      preHandler: adminHook,
      schema: {
        body: z.object({
          email: z.string().email(),
          role: z.enum(['admin', 'user']),
          sender: z.enum(['sendGrid', 'resend'])
        }),
        response: {
          200: z.object({
            success: z.boolean()
          })
        }
      }
    }, async (req) => {
      const { email, role, sender } = req.body;
      const sent = await sendInvite({
        userRepo: fastify.repos.profileRepo,
        email,
        role: role as ERole,
        sender: sender as 'sendGrid' | 'resend'
      });
      return sent;
    });

    fastify.post('/resend', {
      preHandler: adminHook,
      schema: {
        body: z.object({
          email: z.string().email(),
          sender: z.enum(['sendGrid', 'resend'])
        }),
        response: {
          200: z.object({
            success: z.boolean()
          })
        }
      }
    }, async (req) => {
      const { email, sender } = req.body;
      const res = await resendInvite({
        userRepo: fastify.repos.profileRepo,
        email,
        sender
      });
      return res;
    });
};

export default routes;