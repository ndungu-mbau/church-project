CREATE TYPE "public"."membership_status" AS ENUM('active', 'inactive', 'visitor', 'transferred', 'deceased');--> statement-breakpoint
CREATE TYPE "public"."wedding_status" AS ENUM('single', 'married', 'divorced', 'widowed', 'separated');--> statement-breakpoint
CREATE TABLE "member_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"membership_status" "membership_status" DEFAULT 'active' NOT NULL,
	"confirmation_date" date,
	"is_communicant" boolean DEFAULT false NOT NULL,
	"baptism_date" date,
	"baptism_church_id" uuid,
	"baptism_church_name" text,
	"district" text,
	"previous_church_id" uuid,
	"previous_church_name" text,
	"wedding_status" "wedding_status" DEFAULT 'single' NOT NULL,
	"spouse_member_id" uuid,
	"spouse_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "member_data_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
ALTER TABLE "member_data" ADD CONSTRAINT "member_data_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_data" ADD CONSTRAINT "member_data_baptism_church_id_church_id_fk" FOREIGN KEY ("baptism_church_id") REFERENCES "public"."church"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_data" ADD CONSTRAINT "member_data_previous_church_id_church_id_fk" FOREIGN KEY ("previous_church_id") REFERENCES "public"."church"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_data" ADD CONSTRAINT "member_data_spouse_member_id_members_id_fk" FOREIGN KEY ("spouse_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;