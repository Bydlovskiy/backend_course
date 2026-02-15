import { DeletedPostRes } from 'src/types/delete/DeletedPostResSchema';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function restorePosts(
  postRepo: IPostRepo,
  posts: DeletedPostRes[],
  newUserId: string
): Promise<Map<string, string>> {
  const postIdMap = new Map<string, string>();

  for (const post of posts) {
    const created = await postRepo.createPost({
      title: post.title,
      description: post.description,
      authorId: newUserId,
      tags: post.tags || []
    });

    postIdMap.set(post.id, created.id);

    const tagIds = (post.tags || [])
      .map((t) => t.id)
      .filter((id): id is string => id !== undefined);

    if (tagIds.length > 0) {
      await postRepo.replacePostTags(created.id, tagIds);
    }
  }

  return postIdMap;
}
