import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ITransactionManager } from 'src/types/ITransaction';

import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';
import { getArchiveRepo } from 'src/repos/archive.repo';

import { validateUserExists } from 'src/controllers/common/validate-user-exists';
import { IIdentityService } from 'src/types/IIdentityService';
import { CreateHardDeletedReq } from 'src/types/delete/CreateHardDeletedReqSchema';

export async function hardDelete(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  userId: string;
  transactionManager: ITransactionManager;
  identityService: IIdentityService;
}) {
  const {
    profileRepo,
    postRepo,
    commentRepo,
    userId,
    transactionManager,
    identityService
  } = params;

  const user = await validateUserExists(profileRepo, userId);

  const posts = await postRepo.getPostsByAuthorId(userId);
  const postIds = posts.map(p => p.id);

  const userComments = await commentRepo.getCommentsByAuthorId(userId);
  const commentsOnUserPosts = posts.flatMap(p => p.comments || [])
    .filter(c => c.authorId !== userId);

  const archivePayload: CreateHardDeletedReq = {
    profile: user,
    userId,
    payload: {
      posts: posts.map(p => ({
        title: p.title,
        description: p.description,
        tags: (p.tags || []).map(tag => ({ name: tag.name, id: tag.id })),
        id: p.id
      })),
      comments: [...userComments, ...commentsOnUserPosts].map(c => ({
        text: c.text,
        authorId: c.authorId,
        postId: c.postId
      }))
    }
  };

  await transactionManager.execute(async ({ sharedTx }) => {
    const txProfileRepo = getProfileRepo(sharedTx);
    const txPostRepo = getPostRepo(sharedTx);
    const txCommentRepo = getCommentRepo(sharedTx);
    const txArchiveRepo = getArchiveRepo(sharedTx);

    await txArchiveRepo.createArchive(archivePayload);

    await txCommentRepo.deleteCommentsByPostIds(postIds);
    await txCommentRepo.deleteCommentsByAuthorId(userId);
    await txPostRepo.deletePostsByAuthorId(userId);
    await txProfileRepo.deleteById(userId);
  });

  await identityService.deactivateUser(user.email);
}
