import { ITransactionManager } from 'src/types/ITransaction';
import { IIdentityService } from 'src/types/IIdentityService';

import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { validateUserExists } from 'src/controllers/common/validate-user-exists';

export async function softDelete(params: {
  userId: string;
  profileRepo: IProfileRepo;
  transactionManager: ITransactionManager;
  identityService: IIdentityService;
}) {
  const user = await validateUserExists(params.profileRepo, params.userId);

  await params.transactionManager.execute(async ({ sharedTx }) => {
    const txProfileRepo = getProfileRepo(sharedTx);
    const txPostRepo = getPostRepo(sharedTx);
    const txCommentRepo = getCommentRepo(sharedTx);

    await txCommentRepo.softDeleteByAuthorId(params.userId);
    await txPostRepo.softDeleteByAuthorId(params.userId);
    await txProfileRepo.softDeleteById(params.userId);
  });

  await params.identityService.deactivateUser(user.email);
}