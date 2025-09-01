import { IPostRepo } from 'src/types/repos/IPostRepo';
import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { HttpError } from 'src/api/errors/HttpError';  

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: UpdatePostByIdInput;
  currentUserId: string | null | undefined;
  isAdmin?: boolean;
}) {
  if (!params.currentUserId) {
    throw new HttpError(401, 'Unauthorized');
  }

  // Ensure only the author can update the post
  const existing = await params.postRepo.getPostById(params.postId);
  if (!existing) {
    throw new HttpError(400, 'Post not found');
  }
  if (!params.isAdmin && existing.authorId !== params.currentUserId) {
    throw new HttpError(403, 'Forbidden: only the author can update this post');
  }

  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(400, 'Post not found');
  }

  return post;
}