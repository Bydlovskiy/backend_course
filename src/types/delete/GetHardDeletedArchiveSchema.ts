
import { z } from 'zod';
import { ProfileSchema } from '../profile/IProfile';
import { DeletedPostResSchema } from './DeletedPostResSchema';
  
export const GetHardDeletedReqSchema = z.object({
  createdAt: z.date(),
  id: z.string().uuid(),
  profile: ProfileSchema,
  payload: z.object({
    comments: z.array(z.object({
      authorId: z.string().uuid(),
      postId: z.string().uuid(),
      text: z.string()
    })),
    posts: z.array(DeletedPostResSchema).optional().default([])
  })
});
  
export type GetHardDeletedReq = z.infer<typeof GetHardDeletedReqSchema>;