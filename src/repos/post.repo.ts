import { z } from 'zod';
import { eq, count, desc, asc, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { postsTable } from 'src/services/drizzle/schemas/schema';
import { postTagsTable } from 'src/services/drizzle/schemas/schema';
import { tagsTable } from 'src/services/drizzle/schemas/schema';
import { commentsTable } from 'src/services/drizzle/schemas/schema';
import { profilesTable } from 'src/services/drizzle/schemas/schema';
import { IPostRepo, SortDirection, SortField } from 'src/types/repos/IPostRepo';

import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';

import { PostSchema } from 'src/types/post/IPost';
import { HttpError } from 'src/api/errors/HttpError';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  async function fetchPostWithAuthor(id: string) {
    const postAuthor = alias(profilesTable, 'post_author');
    const commentAuthor = alias(profilesTable, 'comment_author');

    const results = await db
      .select({
        post: postsTable,
        postAuthor,
        comment: commentsTable,
        commentAuthor,
        tagId: tagsTable.id,
        tagName: tagsTable.name,
        tags: sql/* json */`
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
            FROM ${postTagsTable} pt
            JOIN ${tagsTable} t ON t.id = pt.tag_id
            WHERE pt.post_id = ${postsTable.id}
          ),
          '[]'::json
        )
      `.as('tags')
      })
      .from(postsTable)
      .innerJoin(postAuthor, eq(postsTable.authorId, postAuthor.id))
      .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
      .leftJoin(commentAuthor, eq(commentsTable.authorId, commentAuthor.id))
      .leftJoin(postTagsTable, eq(postsTable.id, postTagsTable.postId))
      .leftJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
      .where(eq(postsTable.id, id));

    if (results.length === 0) {
      return null;
    }

    const base = results[0];
    const comments = results
      .filter(r => r.comment)
      .map(r => ({
        ...r.comment!,
        author: r.commentAuthor || undefined
      }));

    return {
      ...PostSchema.parse(base.post),
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
      
      const postsWithCommentCounts = db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          authorId: postsTable.authorId,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
          commentsCount: count(commentsTable.id).as('comments_count')
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .where(searchWhereClause)
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
          author: profilesTable
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
      // simple implementation: delete all, insert new
      await db.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
      if (tagIds.length === 0) {return;}
      const rows = tagIds.map(tagId => ({ postId, tagId }));
      await db.insert(postTagsTable).values(rows);
    }
  };
}
