ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "deleted_at" timestamp;