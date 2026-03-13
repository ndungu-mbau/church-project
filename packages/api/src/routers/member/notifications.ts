import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@church-project/db";
import {
  notifications,
  notificationRecipients,
  groupMembers,
} from "@church-project/db/schema";
import { eq, and, or } from "drizzle-orm";

export const memberNotificationsRouter = router({
  // Get all notifications relevant to this member (church-wide or their groups)
  getMyNotifications: memberProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        priority: z.enum(["DEFAULT", "IMPORTANT", "URGENT"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // First, find the member record for this user
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(
            eq(m.userId, ctx.session.user.id),
            eq(m.churchId, ctx.session.churchId!)
          ),
      });

      if (!member)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Member record not found",
        });

      // Get group IDs this member belongs to
      const userGroups = await db.query.groupMembers.findMany({
        where: eq(groupMembers.userId, ctx.session.user.id),
        with: {
          group: true,
        },
      });

      const groupIds = userGroups.map((gm) => gm.groupId).filter(Boolean);

      // Build conditions: church-wide OR in one of member's groups
      const conditions = [
        eq(notifications.churchId, ctx.session.churchId!),
        eq(notifications.status, "PUBLISHED"),
      ];

      // Either church-wide OR for one of their groups
      const scopeCondition =
        groupIds.length > 0
          ? or(
              eq(notifications.isChurchWide, true),
              or(...groupIds.map((gid) => eq(notifications.groupId, gid!)))
            )
          : eq(notifications.isChurchWide, true);

      // Get notifications for this member
      const notificationsList = await db.query.notifications.findMany({
        where: and(...conditions, scopeCondition),
        with: {
          sender: true,
          group: true,
          event: true,
          recipients: {
            where: eq(notificationRecipients.memberId, member.id),
          },
        },
        limit: input.limit,
        offset: input.offset,
        orderBy: (n, { desc }) => desc(n.createdAt),
      });

      // Filter by priority if provided
      const filtered =
        input.priority
          ? notificationsList.filter((n) => n.priority === input.priority)
          : notificationsList;

      return filtered;
    }),

  // Get a specific notification (verify member has access)
  getNotification: memberProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Find the member record
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(
            eq(m.userId, ctx.session.user.id),
            eq(m.churchId, ctx.session.churchId!)
          ),
      });

      if (!member)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Member record not found",
        });

      // Get the notification
      const notification = await db.query.notifications.findFirst({
        where: and(
          eq(notifications.id, input.id),
          eq(notifications.churchId, ctx.session.churchId!)
        ),
        with: {
          sender: true,
          group: true,
          event: true,
          recipients: {
            where: eq(notificationRecipients.memberId, member.id),
          },
        },
      });

      if (!notification)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });

      // Verify member has access to this notification
      let hasAccess = notification.isChurchWide;

      if (!hasAccess && notification.groupId) {
        // Check if member is in the group
        const memberInGroup = await db.query.groupMembers.findFirst({
          where: (gm, { eq, and }) =>
            and(
              eq(gm.userId, ctx.session.user.id),
              eq(gm.groupId, notification.groupId!)
            ),
        });
        hasAccess = !!memberInGroup;
      }

      if (!hasAccess)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this notification",
        });

      return notification;
    }),

  // Mark a notification as read
  markAsRead: memberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find the member record
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(
            eq(m.userId, ctx.session.user.id),
            eq(m.churchId, ctx.session.churchId!)
          ),
      });

      if (!member)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Member record not found",
        });

      // Find the notification recipient record
      const recipient = await db.query.notificationRecipients.findFirst({
        where: (nr, { eq, and }) =>
          and(
            eq(nr.notificationId, input.id),
            eq(nr.memberId, member.id)
          ),
      });

      if (!recipient)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification recipient record not found",
        });

      // Update read_at timestamp
      await db
        .update(notificationRecipients)
        .set({
          readAt: new Date(),
        })
        .where(
          and(
            eq(notificationRecipients.notificationId, input.id),
            eq(notificationRecipients.memberId, member.id)
          )
        );

      return { success: true };
    }),

  // Delete a notification for the member (soft delete)
  deleteNotification: memberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find the member record
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(
            eq(m.userId, ctx.session.user.id),
            eq(m.churchId, ctx.session.churchId!)
          ),
      });

      if (!member)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Member record not found",
        });

      // Find the notification recipient record
      const recipient = await db.query.notificationRecipients.findFirst({
        where: (nr, { eq, and }) =>
          and(
            eq(nr.notificationId, input.id),
            eq(nr.memberId, member.id)
          ),
      });

      if (!recipient)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });

      // Mark as deleted by member
      await db
        .update(notificationRecipients)
        .set({
          deletedByMember: true,
        })
        .where(
          and(
            eq(notificationRecipients.notificationId, input.id),
            eq(notificationRecipients.memberId, member.id)
          )
        );

      return { success: true };
    }),

  // Get unread notification count
  getUnreadCount: memberProcedure.query(async ({ ctx }) => {
    // Find the member record
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(
          eq(m.userId, ctx.session.user.id),
          eq(m.churchId, ctx.session.churchId!)
        ),
    });

    if (!member)
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Member record not found",
      });

    // Count unread notifications for this member
    const unread = await db.query.notificationRecipients.findMany({
      where: (nr, { eq, and, isNull: isNullOp }) =>
        and(
          eq(nr.memberId, member.id),
          isNullOp(nr.readAt),
          eq(nr.deletedByMember, false)
        ),
    });

    return { count: unread.length };
  }),
});
