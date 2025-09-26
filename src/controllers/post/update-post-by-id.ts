import { IPostRepo } from 'src/types/repos/IPostRepo';
import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { HttpError } from 'src/api/errors/HttpError';  
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { resolveExistingTagIds } from 'src/controllers/common/resolve-tags';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  tagRepo: ITagRepo;
  postId: string;
  data: UpdatePostByIdInput;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);
  
  if (!post) {
    throw new HttpError(400, 'Post not found');
  }

  const tagIds = await resolveExistingTagIds(
    { 
      tagRepo: params.tagRepo,
      tags: (params.data as any).tags 
    }
  );
  if (tagIds.length > 0) {
    await params.postRepo.replacePostTags(
      params.postId,
      tagIds
    );
  }

  return post;
}