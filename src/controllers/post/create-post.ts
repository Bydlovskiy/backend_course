import { IPostRepo } from 'src/types/repos/IPostRepo';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';
import { HttpError } from 'src/api/errors/HttpError';  
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { resolveExistingTagIds } from 'src/controllers/common/resolve-tags';

export async function createPost(params: {
  postRepo: IPostRepo;
  tagRepo: ITagRepo;
  data: CreatePostInput;
}) {
  const post = await params.postRepo.createPost(params.data);

  if (!post) {
    throw new HttpError(400, 'Post not created');
  }

  const tagIds = await resolveExistingTagIds(
    { 
      tagRepo: params.tagRepo,
      tags: (params.data as any).tags 
    }
  );
  
  if (tagIds.length > 0) {
    await params.postRepo.replacePostTags(post.id, tagIds);
  }

  return post;
}