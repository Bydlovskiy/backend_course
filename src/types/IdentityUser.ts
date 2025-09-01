import { z } from 'zod';

export const IdentityUserSchema = z.object({
  subId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isEnabled: z.boolean().optional()
});

export type IdentityUser = z.infer<typeof IdentityUserSchema>;