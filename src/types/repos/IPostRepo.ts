import { Post, PostList } from 'src/types/IPost';

export interface IPostRepo {
  getAllPosts(): Promise<PostList | null>;
  createPost(data: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePostById(id: string, data: Partial<Post>): Promise<Post | null>;
}