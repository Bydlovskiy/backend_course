import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(64),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateTagReqSchema = z.object({
  name: z.string().min(1).max(64)
});

export const UpdateTagReqSchema = z.object({
  name: z.string().min(1).max(64)
});

export const ListTagsResSchema = z.array(TagSchema);
