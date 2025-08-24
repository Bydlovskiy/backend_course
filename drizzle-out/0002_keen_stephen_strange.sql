CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"cognito_sub" varchar(64) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_cognitoSub_unique" UNIQUE("cognito_sub"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
