import { IPostRepo } from 'src/types/repos/IPostRepo';
import { Post } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<Post>;
}) {
  const post = await params.postRepo.createPost(params.data);

  return post;
}