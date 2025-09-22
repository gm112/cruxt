CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp with time zone DEFAULT now(),
	"updated_at_utc" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL
);
