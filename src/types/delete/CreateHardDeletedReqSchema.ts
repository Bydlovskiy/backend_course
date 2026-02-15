import { z } from 'zod';
import { ProfileSchema } from '../profile/IProfile';

export const CreateHardDeletedReqSchema = z.object({
  profile: ProfileSchema,
  userId: z.string().uuid(),
  payload: z.object({
    comments: z.array(z.object({
      authorId: z.string().uuid(),
      postId: z.string().uuid(),
      text: z.string()
    })),
    posts: z.array(z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().optional(),
      tags: z.array(z.object({
        id: z.string().uuid(),
        name: z.string()
      }))
    }))
  })
});

export type CreateHardDeletedReq = z.infer<typeof CreateHardDeletedReqSchema>;