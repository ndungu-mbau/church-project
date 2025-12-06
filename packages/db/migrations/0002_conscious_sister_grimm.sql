CREATE TABLE "daily_devotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"content" text,
	"date" timestamp with time zone,
	"link" text,
	"church_id" uuid,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "church_id" uuid;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "church_id" uuid;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "profile_id" uuid;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "profile_id" uuid;--> statement-breakpoint
ALTER TABLE "sermons" ADD COLUMN "church_id" uuid;--> statement-breakpoint
ALTER TABLE "sermons" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD COLUMN "church_id" uuid;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "daily_devotions" ADD CONSTRAINT "daily_devotions_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_devotions" ADD CONSTRAINT "daily_devotions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sermons" ADD CONSTRAINT "sermons_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sermons" ADD CONSTRAINT "sermons_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;