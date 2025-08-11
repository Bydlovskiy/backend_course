import { Post } from 'src/types/post/IPost';

export interface IPostRepo {
  getAllPosts(params?: { limit?: number; offset?: number }): Promise<Post[] | null>;
  createPost(data: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePostById(id: string, data: Partial<Post>): Promise<Post | null>;
}