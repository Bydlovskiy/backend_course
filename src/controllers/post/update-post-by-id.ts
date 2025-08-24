import { IPostRepo } from 'src/types/repos/IPostRepo';
import { Post } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { HttpError } from 'src/api/errors/HttpError';  

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<Post>;
  currentUserId: string | null | undefined;
}) {
  if (!params.currentUserId) {
    throw new HttpError(401, 'Unauthorized');
  }

  // Ensure only the author can update the post
  const existing = await params.postRepo.getPostById(params.postId);
  if (!existing) {
    throw new HttpError(400, 'Post not found');
  }
  if (existing.authorId !== params.currentUserId) {
    throw new HttpError(403, 'Forbidden: only the author can update this post');
  }

  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(400, 'Post not found');
  }

  return post;
}