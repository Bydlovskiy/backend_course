import { z } from 'zod';

export const CreateCommentReqSchema = z.object({
  text: z.string().min(1)
});

export type CreateCommentInput = z.infer<typeof CreateCommentReqSchema>;
