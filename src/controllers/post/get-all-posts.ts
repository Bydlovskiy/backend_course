import { IPostRepo, SortDirection, SortField } from 'src/types/repos/IPostRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getAllPosts(params: {
  postRepo: IPostRepo;
  limit?: number;
  offset?: number;
  searchQuery?: string;
  sortBy?: SortField;
  sortDirection?: SortDirection;
}) {
  const posts = await params.postRepo.getAllPosts({
    limit: params.limit ?? 10,
    offset: params.offset ?? 0,
    searchQuery: params.searchQuery,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection
  });

  if (!posts) {
    throw new HttpError(400, 'Posts not found');
  }

  return posts;
}