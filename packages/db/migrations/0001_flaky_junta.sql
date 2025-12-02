CREATE TYPE "public"."invoice_status" AS ENUM('paid', 'open', 'void', 'uncollectible', 'draft');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('succeeded', 'pending', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."subscription_interval" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid', 'paused');--> statement-breakpoint
CREATE TABLE "church_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"church_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"stripe_subscription_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"status" "invoice_status" NOT NULL,
	"pdf_url" text,
	"stripe_invoice_id" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"status" "payment_status" NOT NULL,
	"provider" text NOT NULL,
	"provider_transaction_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"interval" "subscription_interval" NOT NULL,
	"features" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"stripe_price_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "church_subscription" ADD CONSTRAINT "church_subscription_church_id_church_id_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_subscription" ADD CONSTRAINT "church_subscription_plan_id_subscription_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_subscription_id_church_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."church_subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_church_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."church_subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "church_subscription_church_id_idx" ON "church_subscription" USING btree ("church_id");--> statement-breakpoint
CREATE INDEX "church_subscription_status_idx" ON "church_subscription" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_subscription_id_idx" ON "invoice" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "payment_subscription_id_idx" ON "payment" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "payment_provider_transaction_id_idx" ON "payment" USING btree ("provider_transaction_id");