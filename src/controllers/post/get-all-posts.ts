import { IPostRepo } from 'src/types/repos/IPostRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getAllPosts(params: {
  postRepo: IPostRepo;
  limit?: number;
  offset?: number;
}) {
  const posts = await params.postRepo.getAllPosts({
    limit: params.limit,
    offset: params.offset
  });

  if (!posts) {
    throw new HttpError(400, 'Posts not found');
  }

  return posts;
}