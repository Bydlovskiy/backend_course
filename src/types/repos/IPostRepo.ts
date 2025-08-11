import { Post } from 'src/types/post/IPost';

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface PostsResult {
  posts: Post[];
  meta: PaginationMeta;
}

export interface IPostRepo {
  getAllPosts(params?:
    { limit?: number; offset?: number, searchQuery?: string; }
  ): Promise<PostsResult>;
  createPost(data: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePostById(id: string, data: Partial<Post>): Promise<Post | null>;
}