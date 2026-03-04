CREATE INDEX "notification_recipients_member_id_read_at_idx" ON "notification_recipients" USING btree ("member_id","read_at");--> statement-breakpoint
CREATE INDEX "notification_recipients_notification_id_idx" ON "notification_recipients" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "notifications_group_id_status_idx" ON "notifications" USING btree ("group_id","status");--> statement-breakpoint
CREATE INDEX "notifications_sender_id_created_at_idx" ON "notifications" USING btree ("sender_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_church_id_idx" ON "notifications" USING btree ("church_id");