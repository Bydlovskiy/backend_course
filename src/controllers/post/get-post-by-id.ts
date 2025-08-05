import { IPostRepo } from 'src/types/repos/IPostRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getPostById(params: {
  postRepo: IPostRepo;
  postId: string;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(400, 'Post not found');
  }

  return post;
}