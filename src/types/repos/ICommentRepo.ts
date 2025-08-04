import { Comment } from 'src/api/routes/schemas/comment/CreateCommentResSchema';

export interface ICommentRepo {
  createComment(data: { text: string, postId: string }): Promise<Comment>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  updateCommentById(id: string, data: { text: string }): Promise<Comment | null>;
}
