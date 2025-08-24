import { z } from 'zod';
import { CreateCommentResSchema } from '../comment/CreateCommentResSchema';

export const GetPostByIdRespSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  author: z.object({
    id: z.string(),
    cognitoSub: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
  }),
  updatedAt: z.date(),
  createdAt: z.date(),
  comments: z.array(CreateCommentResSchema).optional()
});

export type Post = z.infer<typeof GetPostByIdRespSchema>;