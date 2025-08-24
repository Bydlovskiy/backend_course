import { IPostRepo } from 'src/types/repos/IPostRepo';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';
import { HttpError } from 'src/api/errors/HttpError';  

export async function createPost(params: {
  postRepo: IPostRepo;
  data: CreatePostInput;
}) {
  const post = await params.postRepo.createPost(params.data);

  if (!post) {
    throw new HttpError(400, 'Post not created');
  }

  return post;
}