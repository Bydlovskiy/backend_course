import { IPostRepo } from 'src/types/repos/IPostRepo';
import { Post } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { HttpError } from 'src/api/errors/HttpError';  

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<Post>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(400, 'Post not found');
  }

  return post;
}