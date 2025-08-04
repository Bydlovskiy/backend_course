import { z } from 'zod';
import { CreateCommentResSchema } from '../comment/CreateCommentResSchema';

export const GetPostByIdRespSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  comments: z.array(CreateCommentResSchema)
});

export type Post = z.infer<typeof GetPostByIdRespSchema>;