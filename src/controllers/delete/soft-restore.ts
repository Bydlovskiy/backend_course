import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IIdentityService } from 'src/types/IIdentityService';

import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';

export async function softRestore(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  userId: string;
  userEmail: string;
  transactionManager: ITransactionManager;
  identityService: IIdentityService;
}) {
  await params.transactionManager.execute(async ({ sharedTx }) => {
    const txProfileRepo = getProfileRepo(sharedTx as any);
    const txPostRepo = getPostRepo(sharedTx as any);
    const txCommentRepo = getCommentRepo(sharedTx as any);

    await txProfileRepo.softRestoreById(params.userId);
    await txPostRepo.softRestoreByAuthorId(params.userId);
    await txCommentRepo.softRestoreByAuthorId(params.userId);
  });

  await params.identityService.activateUser(params.userEmail);
}