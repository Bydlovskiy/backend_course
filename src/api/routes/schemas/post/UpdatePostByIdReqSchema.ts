import { z } from 'zod';

export const UpdatePostByIdReqSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional()
});

export type UpdatePostByIdInput = z.infer<typeof UpdatePostByIdReqSchema>;
