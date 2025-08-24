import { z } from 'zod';

export const GetProfileResSchema = z.object({
  id: z.string(),
  cognitoSub: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
});