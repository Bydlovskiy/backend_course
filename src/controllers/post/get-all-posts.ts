import { IPostRepo } from 'src/types/repos/IPostRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getAllPosts(params: {
  postRepo: IPostRepo;
}) {
  const posts = await params.postRepo.getAllPosts();

  if (!posts) {
    throw new HttpError(400, 'Posts not found');
  }

  return posts;
}