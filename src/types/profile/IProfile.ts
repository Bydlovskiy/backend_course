import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  cognitoSub: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Profile = z.infer<typeof ProfileSchema>;
