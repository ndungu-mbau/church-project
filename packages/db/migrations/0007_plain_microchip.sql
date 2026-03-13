CREATE TYPE "public"."notification_priority" AS ENUM('DEFAULT', 'IMPORTANT', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('ANNOUNCEMENT', 'EVENT', 'DONATION', 'SYSTEM_ALERT', 'OTHER');--> statement-breakpoint
CREATE TABLE "notification_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"read_at" timestamp with time zone,
	"deleted_by_member" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "notification_type" DEFAULT 'ANNOUNCEMENT' NOT NULL,
	"status" "notification_status" DEFAULT 'DRAFT' NOT NULL,
	"priority" "notification_priority" DEFAULT 'DEFAULT' NOT NULL,
	"sender_id" uuid NOT NULL,
	"church_id" uuid NOT NULL,
	"group_id" uuid,
	"event_id" uuid,
	"is_church_wide" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "daily_devotions" ADD COLUMN "verses" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "sermons" ADD COLUMN "verses" text[];--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_recipients_member_id_read_at_idx" ON "notification_recipients" USING btree ("member_id","read_at");--> statement-breakpoint
CREATE INDEX "notification_recipients_notification_id_idx" ON "notification_recipients" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "notifications_group_id_status_idx" ON "notifications" USING btree ("group_id","status");--> statement-breakpoint
CREATE INDEX "notifications_sender_id_created_at_idx" ON "notifications" USING btree ("sender_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_church_id_idx" ON "notifications" USING btree ("church_id");