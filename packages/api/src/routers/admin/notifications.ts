import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import {
	notifications,
	notificationRecipients,
} from "@church-project/db/schema/notifications";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const notificationInputSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1),
	type: z.enum(["ANNOUNCEMENT", "EVENT", "DONATION", "SYSTEM_ALERT", "OTHER"]),
	status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED", "DELETED"]),
	priority: z.enum(["DEFAULT", "IMPORTANT", "URGENT"]),
	groupId: z.string().uuid().optional().nullable(),
	eventId: z.string().uuid().optional().nullable(),
	isChurchWide: z.boolean().default(false),
	scheduledFor: z.date().optional().nullable(),
});

export const adminNotificationsRouter = router({
	// Create a new notification (starts as DRAFT)
	create: adminProcedure
		.input(notificationInputSchema)
		.mutation(async ({ ctx, input }) => {
			const [notification] = await db
				.insert(notifications)
				.values({
					title: input.title,
					content: input.content,
					type: input.type,
					status: input.status || "DRAFT",
					priority: input.priority || "DEFAULT",
					senderId: ctx.session.user.id,
					churchId: ctx.session.churchId!,
					groupId: input.groupId || null,
					eventId: input.eventId || null,
					isChurchWide: input.isChurchWide || false,
					scheduledFor: input.scheduledFor || null,
				})
				.returning();

			if (!notification)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create notification",
				});

			return notification;
		}),

	// Get all notifications for the church with filters
	list: adminProcedure
		.input(
			z.object({
				status: z
					.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED", "DELETED"])
					.optional(),
				priority: z.enum(["DEFAULT", "IMPORTANT", "URGENT"]).optional(),
				groupId: z.string().uuid().optional(),
				type: z
					.enum(["ANNOUNCEMENT", "EVENT", "DONATION", "SYSTEM_ALERT", "OTHER"])
					.optional(),
				limit: z.number().default(50),
				offset: z.number().default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(notifications.churchId, ctx.session.churchId!)];

			if (input.status) conditions.push(eq(notifications.status, input.status));
			if (input.priority)
				conditions.push(eq(notifications.priority, input.priority));
			if (input.groupId)
				conditions.push(eq(notifications.groupId, input.groupId));
			if (input.type) conditions.push(eq(notifications.type, input.type));

			const items = await db.query.notifications.findMany({
				where: and(...conditions),
				with: {
					sender: true,
					group: true,
					event: true,
				},
				limit: input.limit,
				offset: input.offset,
				orderBy: (n, { desc }) => desc(n.createdAt),
			});

			console.log({ items });
			return items;
		}),

	// Get a specific notification
	get: adminProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const notification = await db.query.notifications.findFirst({
				where: (n, { eq, and }) =>
					and(eq(n.id, input.id), eq(n.churchId, ctx.session.churchId!)),
				with: {
					sender: true,
					group: true,
					event: true,
					recipients: true,
				},
			});

			if (!notification)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Notification not found",
				});

			return notification;
		}),

	// Update a notification (only DRAFT or SCHEDULED can be edited)
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).max(255).optional(),
				content: z.string().min(1).optional(),
				type: z
					.enum(["ANNOUNCEMENT", "EVENT", "DONATION", "SYSTEM_ALERT", "OTHER"])
					.optional(),
				priority: z.enum(["DEFAULT", "IMPORTANT", "URGENT"]).optional(),
				groupId: z.string().uuid().optional().nullable(),
				eventId: z.string().uuid().optional().nullable(),
				isChurchWide: z.boolean().optional(),
				scheduledFor: z.date().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify notification exists and belongs to church
			const existing = await db.query.notifications.findFirst({
				where: (n, { eq, and }) =>
					and(eq(n.id, input.id), eq(n.churchId, ctx.session.churchId!)),
			});

			if (!existing)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Notification not found",
				});

			// Only allow editing DRAFT or SCHEDULED notifications
			if (existing.status !== "DRAFT" && existing.status !== "SCHEDULED")
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Can only edit DRAFT or SCHEDULED notifications",
				});

			const [updated] = await db
				.update(notifications)
				.set({
					title: input.title ?? existing.title,
					content: input.content ?? existing.content,
					type: input.type ?? existing.type,
					priority: input.priority ?? existing.priority,
					groupId:
						input.groupId !== undefined ? input.groupId : existing.groupId,
					eventId:
						input.eventId !== undefined ? input.eventId : existing.eventId,
					isChurchWide: input.isChurchWide ?? existing.isChurchWide,
					scheduledFor:
						input.scheduledFor !== undefined
							? input.scheduledFor
							: existing.scheduledFor,
					updatedAt: new Date(),
				})
				.where(eq(notifications.id, input.id))
				.returning();

			if (!updated)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update notification",
				});

			return updated;
		}),

	// Delete a notification (soft delete - set status to DELETED, or hard delete if DRAFT)
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const notification = await db.query.notifications.findFirst({
				where: (n, { eq, and }) =>
					and(eq(n.id, input.id), eq(n.churchId, ctx.session.churchId!)),
			});

			if (!notification)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Notification not found",
				});

			// Hard delete if DRAFT, soft delete otherwise
			if (notification.status === "DRAFT") {
				// Hard delete
				await db
					.delete(notificationRecipients)
					.where(eq(notificationRecipients.notificationId, input.id));
				await db.delete(notifications).where(eq(notifications.id, input.id));
			} else {
				// Soft delete
				await db
					.update(notifications)
					.set({ status: "DELETED" })
					.where(eq(notifications.id, input.id));
			}

			return { success: true };
		}),

	// Preview who will receive this notification before publishing
	preview: adminProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const notification = await db.query.notifications.findFirst({
				where: (n, { eq, and }) =>
					and(eq(n.id, input.id), eq(n.churchId, ctx.session.churchId!)),
				with: {
					group: true,
				},
			});

			if (!notification)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Notification not found",
				});

			let recipientCount = 0;
			let groupName: string | null = null;

			if (notification.isChurchWide) {
				// Count all members in church
				const allMembers = await db.query.members.findMany({
					where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
				});
				recipientCount = allMembers.length;
				groupName = "Entire Church";
			} else if (notification.groupId) {
				// Count members in group
				const groupMembers = await db.query.members.findMany({
					where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
				});
				// Filter members who are in the group (would need to query group_members)
				recipientCount = groupMembers.length; // simplified - should filter by group
				groupName = notification.group?.name || "Unknown Group";
			}

			return {
				recipientCount,
				targetGroup: groupName,
				notificationId: notification.id,
			};
		}),

	// Publish a notification (creates recipient records)
	publish: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const notification = await db.query.notifications.findFirst({
				where: (n, { eq, and }) =>
					and(eq(n.id, input.id), eq(n.churchId, ctx.session.churchId!)),
				with: {
					group: true,
				},
			});

			if (!notification)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Notification not found",
				});

			if (notification.status === "PUBLISHED")
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Notification is already published",
				});

			// Get list of recipients
			let recipientMemberIds: string[] = [];

			if (notification.isChurchWide) {
				// Get all members in church
				const allMembers = await db.query.members.findMany({
					where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
				});
				recipientMemberIds = allMembers.map((m) => m.id);
			} else if (notification.groupId) {
				// Get members in the group through group_members join
				const groupMemberships = await db.query.groupMembers.findMany({
					where: (gm, { eq }) => eq(gm.groupId, notification.groupId!),
					with: {
						user: true,
					},
				});

				// Get member records for users in this group
				const userIds = groupMemberships
					.map((gm) => gm.userId)
					.filter((id): id is string => id !== null && id !== undefined);

				if (userIds.length > 0) {
					const membersInGroup = await db.query.members.findMany({
						where: (m, { eq, and, inArray: inArrayFn }) =>
							and(
								eq(m.churchId, ctx.session.churchId!),
								inArrayFn(m.userId, userIds),
							),
					});
					recipientMemberIds = membersInGroup.map((m) => m.id);
				}
			}

			// Create notification_recipients records (bulk insert)
			if (recipientMemberIds.length > 0) {
				const recipientRecords = recipientMemberIds.map((memberId) => ({
					notificationId: input.id,
					memberId,
				}));

				await db.insert(notificationRecipients).values(recipientRecords);
			}

			// Update notification status
			const [updated] = await db
				.update(notifications)
				.set({
					status: "PUBLISHED",
					publishedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(notifications.id, input.id))
				.returning();

			return updated;
		}),

	// Get notifications for a specific group (for group details view)
	getGroupNotifications: adminProcedure
		.input(z.object({ groupId: z.string() }))
		.query(async ({ ctx, input }) => {
			const items = await db.query.notifications.findMany({
				where: (n, { eq, and }) =>
					and(
						eq(n.churchId, ctx.session.churchId!),
						eq(n.groupId, input.groupId),
					),
				with: {
					sender: true,
					event: true,
				},
				orderBy: (n, { desc }) => desc(n.createdAt),
			});

			return items;
		}),

	// Get notifications for a specific event (for event details view)
	getEventNotifications: adminProcedure
		.input(z.object({ eventId: z.string() }))
		.query(async ({ ctx, input }) => {
			const items = await db.query.notifications.findMany({
				where: (n, { eq, and }) =>
					and(
						eq(n.churchId, ctx.session.churchId!),
						eq(n.eventId, input.eventId),
					),
				with: {
					sender: true,
					group: true,
				},
				orderBy: (n, { desc }) => desc(n.createdAt),
			});

			return items;
		}),
});
