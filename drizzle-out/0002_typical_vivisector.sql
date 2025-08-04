ALTER TABLE "entities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "entities" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "description" SET DATA TYPE varchar(255);