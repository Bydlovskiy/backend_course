CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "posts_title_idx" ON "posts" USING gin ("title" gin_trgm_ops);
CREATE INDEX "posts_description_idx" ON "posts" USING gin ("description" gin_trgm_ops);