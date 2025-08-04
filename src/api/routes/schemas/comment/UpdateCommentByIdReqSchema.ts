import { z } from 'zod';

export const UpdateCommentByIdReqSchema = z.object({
  text: z.string().min(1)
});

export type UpdateCommentByIdInput = z.infer<typeof UpdateCommentByIdReqSchema>;
