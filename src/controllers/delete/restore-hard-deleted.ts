import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';
import { getArchiveRepo } from 'src/repos/archive.repo';

import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IIdentityService } from 'src/types/IIdentityService';
import { restorePosts } from 'src/controllers/common/restore-posts';
import { restoreComments } from 'src/controllers/common/restore-comments';

export async function restoreHardDeleted(params: {
  archiveRepo: IArchiveRepo;
  userId: string;
  transactionManager: ITransactionManager;
  identityService: IIdentityService;
}) {
  const { archiveRepo, userId, transactionManager, identityService } = params;

  const archive = await archiveRepo.getArchiveById(userId);

  if (!archive) {
    throw new Error('Archive not found for this user');
  }

  await transactionManager.execute(async ({ sharedTx }) => {
    const txProfileRepo = getProfileRepo(sharedTx);
    const txPostRepo = getPostRepo(sharedTx);
    const txCommentRepo = getCommentRepo(sharedTx);
    const txArchiveRepo = getArchiveRepo(sharedTx);

    const newUser = await txProfileRepo.createProfile({
      email: archive.profile.email,
      firstName: archive.profile.firstName,
      lastName: archive.profile.lastName,
      role: archive.profile.role,
      activatedAt: archive.profile.activatedAt ?? null
    });

    const postIdMap = await restorePosts(txPostRepo, archive.payload.posts, newUser.id);

    await restoreComments(
      txCommentRepo,
      archive.payload.comments,
      postIdMap,
      userId,
      newUser.id
    );

    await txArchiveRepo.deleteArchive(archive.id);
  });

  await identityService.activateUser(archive.profile.email);
}