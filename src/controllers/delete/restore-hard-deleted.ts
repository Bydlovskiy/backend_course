import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';
import { getArchiveRepo } from 'src/repos/archive.repo';

import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IIdentityService } from 'src/types/IIdentityService';

export async function restoreHardDeleted(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  userId: string;
  userEmail: string;
  transactionManager: ITransactionManager;
  identityService: IIdentityService;

}) {
  const { archiveRepo, userId, userEmail, transactionManager, identityService } = params;

  const archive = (await archiveRepo.getArchiveById(userId))[0];

  if (!archive) {
    throw new Error('Archive not found for this user');
  }

  await transactionManager.execute(async ({ sharedTx }) => {
    const txProfileRepo = getProfileRepo(sharedTx as any);
    const txPostRepo = getPostRepo(sharedTx as any);
    const txCommentRepo = getCommentRepo(sharedTx as any);
    const txArchiveRepo = getArchiveRepo(sharedTx as any);

    const newUser = await txProfileRepo.createProfile({
      email: userEmail,
      firstName: archive.profile.firstName,
      lastName: archive.profile.lastName,
      role: archive.profile.role,
      activatedAt: archive.profile.activatedAt ?? null
    });

    const postIdMap = new Map<string, string>();

    for (const post of archive.payload.posts) {
      const created = await txPostRepo.createPost({
        title: post.title,
        description: post.description,
        authorId: newUser.id,
        tags: post.tags
      });

      postIdMap.set(post.id, created.id);

      const tagIds = (post.tags || [])
        .map((t: { id?: string; name: string }) => t.id);

      if (tagIds.length > 0) {
        await txPostRepo.replacePostTags(created.id, tagIds);
      }
    }

    for (const comment of archive.payload.comments) {
      const newPostId = postIdMap.get(comment.postId) || comment.postId;
      const newAuthorId = comment.authorId === userId ? newUser.id : comment.authorId;

      await txCommentRepo.createComment({
        text: comment.text,
        postId: newPostId,
        authorId: newAuthorId
      });
    }

    await txArchiveRepo.deleteArchive(archive.id);
  });

  await identityService.activateUser(userEmail);
}