import { z } from 'zod';

export const AcceptInviteReqSchema = z.object({
    email: z.string(),
    signature: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    expireAt: z.number(),
    password: z.string()
});
