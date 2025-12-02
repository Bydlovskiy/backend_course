CREATE TABLE "archives" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"profile" jsonb NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
