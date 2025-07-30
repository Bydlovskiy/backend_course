import { z } from 'zod';

export const IdentityUserSchema = z.object({
  subId: z.string(),
  email: z.string()
});

export type IdentityUser = z.infer<typeof IdentityUserSchema>;