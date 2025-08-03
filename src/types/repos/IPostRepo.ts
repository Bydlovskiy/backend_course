import { PostList } from 'src/api/routes/schemas/post/GetPostsListRespSchema';
import { Post } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';

export interface IPostRepo {
  getAllPosts(): Promise<PostList | null>;
  createPost(data: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePostById(id: string, data: Partial<Post>): Promise<Post | null>;
}