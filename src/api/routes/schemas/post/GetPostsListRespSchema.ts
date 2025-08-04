import { z } from 'zod';

export const GetPostsListRespSchema = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      updatedAt: z.date(),
      createdAt: z.date(),
      commentsCount: z.number()
    })
  )
});

export type PostList = z.infer<typeof GetPostsListRespSchema>;