import { Post } from 'src/types/post/IPost';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';
import { Profile } from 'src/types/profile/IProfile';
import { Comment } from 'src/types/comment/IComment';

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export type PostWithAuthor = Post & {
  author: Profile;
  comments?: (Comment & { author: Profile })[];
};

export type PostListItem = Omit<Post, 'comments'> & {
  author: Profile;
};

export interface PostsResult {
  posts: PostListItem[];
  meta: PaginationMeta;
}

export type SortField = 'title' | 'createdAt' | 'commentsCount';
export type SortDirection = 'asc' | 'desc';

export interface IPostRepo {
  getAllPosts(params?:
    { 
      limit?: number; 
      offset?: number; 
      searchQuery?: string;
      sortBy?: SortField;
      sortDirection?: SortDirection;
      minCommentsCount?: number;
    }
  ): Promise<PostsResult>;
  createPost(data: CreatePostInput): Promise<PostWithAuthor>;
  getPostById(id: string): Promise<PostWithAuthor | null>;
  updatePostById(id: string, data: Partial<Post>): Promise<PostWithAuthor | null>;
}