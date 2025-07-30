import { z } from 'zod';

export const UpdateEntityReqSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable()
});