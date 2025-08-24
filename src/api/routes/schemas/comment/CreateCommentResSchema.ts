import { z } from 'zod';

export const CreateCommentResSchema = z.object({
  id: z.string(),
  postId: z.string(),
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
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Comment = z.infer<typeof CreateCommentResSchema>;