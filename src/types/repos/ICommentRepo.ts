import { Comment } from '../comment/IComment';
import { Profile } from '../profile/IProfile';

export type CommentWithAuthor = Comment & { author: Profile };

export interface ICommentRepo {
  createComment(
    data: { text: string; postId: string; authorId: string }
  ): Promise<CommentWithAuthor>;
  getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]>;
  getCommentById(id: string): Promise<CommentWithAuthor | null>;
  updateCommentById(
    id: string,
    data: { text: string }
  ): Promise<CommentWithAuthor | null>;
}
