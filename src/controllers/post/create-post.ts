import { IPostRepo } from 'src/types/repos/IPostRepo';
import { Post } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { HttpError } from 'src/api/errors/HttpError';  

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<Post>;
}) {
  const post = await params.postRepo.createPost(params.data);

  if (!post) {
    throw new HttpError(400, 'Post not created');
  }

  return post;
}