import { z } from 'zod';
import { eq, count, desc, asc, sql, inArray, and, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { postsTable } from 'src/services/drizzle/schemas/schema';
import { postTagsTable } from 'src/services/drizzle/schemas/schema';
import { tagsTable } from 'src/services/drizzle/schemas/schema';
import { commentsTable } from 'src/services/drizzle/schemas/schema';
import { profilesTable } from 'src/services/drizzle/schemas/schema';
import { IPostRepo, SortDirection, SortField, PostWithAuthor } from 'src/types/repos/IPostRepo';

import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';

import { PostSchema } from 'src/types/post/IPost';
import { HttpError } from 'src/api/errors/HttpError';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  async function fetchPostWithAuthor(id: string) {
    const postAuthor = alias(profilesTable, 'post_author');
    const commentAuthor = alias(profilesTable, 'comment_author');

    const baseRows = await db
      .select({
        post: postsTable,
        postAuthor
      })
      .from(postsTable)
      .leftJoin(postAuthor, eq(postsTable.authorId, postAuthor.id))
      .where(eq(postsTable.id, id));

    if (baseRows.length === 0) {
      return null;
    }

    const base = baseRows[0];

    const tagsRows = await db
      .select({
        tags: sql`
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT('id', ${tagsTable.id}, 'name', ${tagsTable.name})
            ) FILTER (WHERE ${tagsTable.id} IS NOT NULL),
            '[]'
          )
        `.as('tags')
      })
      .from(postTagsTable)
      .leftJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
      .where(eq(postTagsTable.postId, id));

    const tags = tagsRows[0]?.tags ?? '[]';

    const commentRows = await db
      .select({
        comment: commentsTable,
        commentAuthor
      })
      .from(commentsTable)
      .leftJoin(commentAuthor, eq(commentsTable.authorId, commentAuthor.id))
      .where(and(
        eq(commentsTable.postId, id),
        isNull(commentsTable.deletedAt)
      ))
      .orderBy(commentsTable.createdAt);

    const comments = commentRows
      .filter(r => r.comment)
      .map(r => ({
        ...r.comment!,
        author: r.commentAuthor || undefined
      }));

    return {
      ...PostSchema.parse({
        ...base.post,
        tags
      }),
      author: base.postAuthor,
      comments
    } as any;
  }

  return {
    async createPost(data: CreatePostInput) {
      const post = await db.insert(postsTable).values(data as any).returning();
      return await fetchPostWithAuthor(post[0].id);
    },

    async getPostById(id: string) {
      return await fetchPostWithAuthor(id);
    },

    async getAllPosts(params?: { 
      limit?: number; 
      offset?: number; 
      searchQuery?: string;
      sortBy?: SortField;
      sortDirection?: SortDirection;
      minCommentsCount?: number;
      tagIds?: string[];
    }) {
      if (params?.limit && params.limit > 100) {
        throw new HttpError(1001, 'Limit cannot exceed 100');
      }
      
      const limit = params?.limit ?? 10;
      const offset = params?.offset ?? 0;
      const searchQuery = params?.searchQuery?.trim();
      const sortBy = params?.sortBy ?? 'createdAt';
      const sortDirection = params?.sortDirection ?? 'desc';
      const minCommentsCount = params?.minCommentsCount;
      const tagIds = params?.tagIds || [];

      const similarityThreshold = 0.3;
      let searchWhereClause = undefined as unknown as ReturnType<typeof sql> | undefined;
      if (searchQuery) {
        searchWhereClause = sql`(
          similarity(${postsTable.title}, ${searchQuery}) > ${similarityThreshold}
          OR similarity(${postsTable.description}, ${searchQuery}) > ${similarityThreshold}
        )`;
      }
      
      let commentsCountFilter = undefined;
      if (minCommentsCount !== undefined && minCommentsCount > 0) {
        commentsCountFilter = sql`"comments_count" >= ${minCommentsCount}`;
      }

      const tagFilterWhere = tagIds.length > 0
        ? sql`${postsTable.id} IN (
            SELECT ${postTagsTable.postId}
            FROM ${postTagsTable}
            WHERE ${inArray(postTagsTable.tagId, tagIds)}
          )`
        : undefined;

      const combinedWhere = searchWhereClause && tagFilterWhere
        ? and(searchWhereClause, tagFilterWhere)
        : (searchWhereClause || tagFilterWhere);

      const postsWithCommentCounts = db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          authorId: postsTable.authorId,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
          tags: sql`
            COALESCE(
              JSON_AGG(
                DISTINCT JSONB_BUILD_OBJECT('id', ${tagsTable.id}, 'name', ${tagsTable.name})
              ) FILTER (WHERE ${tagsTable.id} IS NOT NULL),
              '[]'::json
            )
          `.as('tags'),
          commentsCount: count(commentsTable.id).as('comments_count')
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.postId))
        .leftJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
        .where(and(isNull(postsTable.deletedAt), combinedWhere))
        .groupBy(postsTable.id)
        .as('posts_with_comments');
      
      const query = db
        .select({
          id: postsWithCommentCounts.id,
          title: postsWithCommentCounts.title,
          description: postsWithCommentCounts.description,
          authorId: postsWithCommentCounts.authorId,
          createdAt: postsWithCommentCounts.createdAt,
          updatedAt: postsWithCommentCounts.updatedAt,
          commentsCount: postsWithCommentCounts.commentsCount,
          author: profilesTable,
          tags: postsWithCommentCounts.tags
        })
        .from(postsWithCommentCounts)
        .innerJoin(profilesTable, eq(postsWithCommentCounts.authorId, profilesTable.id));
      
      if (commentsCountFilter) {
        query.where(commentsCountFilter);
      }
      
      switch (sortBy) {
        case 'title':
          query.orderBy(sortDirection === 'asc' ? asc(postsWithCommentCounts.title) : desc(postsWithCommentCounts.title));
          break;
        case 'commentsCount':
          query.orderBy(sortDirection === 'asc' ? asc(postsWithCommentCounts.commentsCount) : desc(postsWithCommentCounts.commentsCount));
          break;
        case 'createdAt':
        default:
          query.orderBy(sortDirection === 'asc' ? asc(postsWithCommentCounts.createdAt) : desc(postsWithCommentCounts.createdAt));
          break;
      }
      
      const posts = await query.limit(limit).offset(offset);
      
      const totalCountQuery = db
        .select({ count: sql`count(*)` })
        .from(postsWithCommentCounts);
      
      if (commentsCountFilter) {
        totalCountQuery.where(commentsCountFilter);
      }
      
      const totalCountResult = await totalCountQuery;
      const total = Number(totalCountResult[0]?.count) || 0;
      
      const page = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(total / limit);

      return {
        posts: z.array(
          PostSchema.extend({
            author: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              firstName: z.string(),
              lastName: z.string(),
              role: z.enum(['user', 'admin']),
              createdAt: z.date(),
              updatedAt: z.date()
            })
          })
        ).parse(posts),
        meta: {
          total,
          limit,
          offset,
          page,
          totalPages
        }
      };
    },

    async updatePostById(id: string, data: UpdatePostByIdInput) {
      const post = await db
        .update(postsTable)
        .set(data)
        .where(eq(postsTable.id, id))
        .returning();
      
      if (post.length === 0) {
        return null;
      }
      return await fetchPostWithAuthor(post[0].id);
    },

    async replacePostTags(postId: string, tagIds: string[]) {
      await db.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
      if (tagIds.length === 0) {return;}
      const rows = tagIds.map(tagId => ({ postId, tagId }));
      await db.insert(postTagsTable).values(rows);
    },

    async softDeleteByAuthorId(authorId: string) {
      await db
        .update(postsTable)
        .set({ deletedAt: new Date() })
        .where(eq(postsTable.authorId, authorId));
    },

    async softRestoreByAuthorId(authorId: string) {
      await db
        .update(postsTable)
        .set({ deletedAt: null })
        .where(eq(postsTable.authorId, authorId));
    },

    async getPostsByAuthorId(authorId: string) {
      const rows = await db
        .select({
          id: postsTable.id
        })
        .from(postsTable)
        .where(eq(postsTable.authorId, authorId));
      
      const posts = await Promise.all(rows.map(r => fetchPostWithAuthor(r.id)));
      return posts.filter((p): p is PostWithAuthor => p !== null);
    },

    async deletePostsByAuthorId(authorId: string) {
      await db.delete(postsTable).where(eq(postsTable.authorId, authorId));
    }
  };
}
