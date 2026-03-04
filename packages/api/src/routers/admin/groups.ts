import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { groups } from "@church-project/db/schema/groups";
import { notifications } from "@church-project/db/schema/notifications";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminGroupsRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    const items = await db.query.groups.findMany({
      where: (g, { eq }) => eq(g.churchId, ctx.session.churchId!),
      with: {
        leader: true,
      },
    });
    return items;
  }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await db.query.groups.findFirst({
        where: (g, { eq, and }) =>
          and(eq(g.id, input.id), eq(g.churchId, ctx.session.churchId!)),
        with: {
          leader: true,
          church: true,
        },
      });
      if (!item)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      return item;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        leaderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [group] = await db
        .insert(groups)
        .values({
          name: input.name,
          description: input.description,
          leaderId: input.leaderId ?? ctx.session.user.id,
          churchId: ctx.session.churchId!,
          createdBy: ctx.session.user.id,
        })
        .returning();

      return group;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        leaderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.groups.findFirst({
        where: (g, { eq, and }) =>
          and(eq(g.id, input.id), eq(g.churchId, ctx.session.churchId!)),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      }

      const [updated] = await db
        .update(groups)
        .set({
          ...(input.name ? { name: input.name } : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.leaderId !== undefined ? { leaderId: input.leaderId } : {}),
        })
        .where(eq(groups.id, input.id))
        .returning();

      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.groups.findFirst({
        where: (g, { eq, and }) =>
          and(eq(g.id, input.id), eq(g.churchId, ctx.session.churchId!)),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      }

      await db.delete(groups).where(eq(groups.id, input.id));
      return { success: true };
    }),

  getMembers: adminProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify group ownership
      const group = await db.query.groups.findFirst({
        where: (g, { eq, and }) =>
          and(eq(g.id, input.groupId), eq(g.churchId, ctx.session.churchId!)),
      });

      if (!group) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      }

      const members = await db.query.groupMembers.findMany({
        where: (gm, { eq }) => eq(gm.groupId, input.groupId),
        with: {
          user: true,
        },
      });

      return members;
    }),

  // Get notifications sent to this group
  getGroupNotifications: adminProcedure
    .input(
      z.object({
        groupId: z.string(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify group exists and belongs to church
      const group = await db.query.groups.findFirst({
        where: (g, { eq, and }) =>
          and(eq(g.id, input.groupId), eq(g.churchId, ctx.session.churchId!)),
      });

      if (!group) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      }

      // Get notifications sent to this group
      const groupNotifications = await db.query.notifications.findMany({
        where: (n, { eq, and }) =>
          and(
            eq(n.groupId, input.groupId),
            eq(n.churchId, ctx.session.churchId!),
            eq(n.status, "PUBLISHED")
          ),
        with: {
          sender: true,
          recipients: true,
        },
        limit: input.limit,
        offset: input.offset,
        orderBy: (n, { desc }) => desc(n.publishedAt),
      });

      return groupNotifications;
    }),
});
