import { z } from 'zod';

export const CreateEntityReqSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable()
});