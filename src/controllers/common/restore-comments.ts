import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function restoreComments(
  commentRepo: ICommentRepo,
  comments: Array<{ text: string; authorId: string; postId: string }>,
  postIdMap: Map<string, string>,
  oldUserId: string,
  newUserId: string
): Promise<void> {
  for (const comment of comments) {
    const newPostId = postIdMap.get(comment.postId) || comment.postId;
    const newAuthorId = comment.authorId === oldUserId ? newUserId : comment.authorId;

    await commentRepo.createComment({
      text: comment.text,
      postId: newPostId,
      authorId: newAuthorId
    });
  }
}
