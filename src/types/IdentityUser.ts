import { z } from 'zod';

export const IdentityUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isEnabled: z.boolean().optional(),
  status: z.enum(['FORCE_CHANGE_PASSWORD', 'CONFIRMED', 'PENDING_CONFIRMATION']).optional()
});

export type IdentityUser = z.infer<typeof IdentityUserSchema>;