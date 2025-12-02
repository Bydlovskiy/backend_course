import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ITransactionManager } from 'src/types/ITransaction';

import { getProfileRepo } from 'src/repos/profile.repo';
import { getPostRepo } from 'src/repos/post.repo';
import { getCommentRepo } from 'src/repos/comment.repo';
import { getArchiveRepo } from 'src/repos/archive.repo';

import { CreatePostInput } from 'src/types/post/ICreatePostInput';
import { Profile } from 'src/types/profile/IProfile';

export async function hardDelete(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  userId: string;
  userEmail: string;
  transactionManager: ITransactionManager;
  identityService: any;
}) {
  const { 
    profileRepo,
    postRepo,
    commentRepo,
    userId,
    userEmail,
    transactionManager,
    identityService
  } = params;

  const user = await profileRepo.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const posts = await postRepo.getPostsByAuthorId(userId);
  const postIds = posts.map(p => p.id);

  const userComments = await commentRepo.getCommentsByAuthorId(userId);
  const commentsOnUserPosts = posts.flatMap(p => p.comments || [])
    .filter(c => c.authorId !== userId);

  const archivePayload: {
    profile: Profile;
    userId: string;
    payload: {
      posts: (CreatePostInput & { id: string })[];
      comments: {
        text: string;
        authorId: string;
        postId: string;
      }[];
    };
  } = {
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
    const txProfileRepo = getProfileRepo(sharedTx as any);
    const txPostRepo = getPostRepo(sharedTx as any);
    const txCommentRepo = getCommentRepo(sharedTx as any);
    const txArchiveRepo = getArchiveRepo(sharedTx as any);

    await txArchiveRepo.createArchive(archivePayload);

    await txCommentRepo.deleteCommentsByPostIds(postIds);
    await txCommentRepo.deleteCommentsByAuthorId(userId);
    await txPostRepo.deletePostsByAuthorId(userId);
    await txProfileRepo.deleteById(userId);
  });

  await identityService.deactivateUser(userEmail);
}
