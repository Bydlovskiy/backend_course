import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getProfileRepo } from './profile.repo';
import { getTagRepo } from './tag.repo';
  
import { getArchiveRepo } from './archive.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    profileRepo: getProfileRepo(db),
    tagRepo: getTagRepo(db),
    archiveRepo: getArchiveRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;