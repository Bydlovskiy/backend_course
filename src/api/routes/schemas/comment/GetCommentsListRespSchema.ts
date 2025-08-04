import { z } from 'zod';
import { CreateCommentResSchema } from './CreateCommentResSchema';

export const GetCommentsListRespSchema = z.array(CreateCommentResSchema);

export type CommentList = z.infer<typeof GetCommentsListRespSchema>;
