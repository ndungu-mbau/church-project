import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@church-project/db";
import { groupMembers } from "@church-project/db/schema";
import { eq } from "drizzle-orm";

export const memberGroupsRouter = router({
  list: memberProcedure
    .query(async ({ ctx }) => {
      const items = await db.query.groups.findMany({
        where: (group, { eq }) => eq(group.churchId, ctx.session.churchId!),
        orderBy: (group, { asc }) => [asc(group.name)],
      });
      return items;
    }),

  get: memberProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const group = await db.query.groups.findFirst({
        where: (group, { eq, and }) => and(
          eq(group.id, input.id),
          eq(group.churchId, ctx.session.churchId!)
        ),
        with: {
            leader: true,
        }
      });
      if (!group) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      return group;
    }),

  myGroups: memberProcedure
    .query(async ({ ctx }) => {
      const members = await db.query.groupMembers.findMany({
        where: (gm, { eq }) => eq(gm.userId, ctx.session.user.id),
        with: {
          group: true,
        }
      });
      return members.map(m => m.group);
    }),

  join: memberProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
       const group = await db.query.groups.findFirst({
        where: (group, { eq, and }) => and(
          eq(group.id, input.groupId),
          eq(group.churchId, ctx.session.churchId!)
        ),
      });
      if (!group) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });

      const existing = await db.query.groupMembers.findFirst({
         where: (gm, { eq, and }) => and(
           eq(gm.groupId, input.groupId),
           eq(gm.userId, ctx.session.user.id)
         )
      });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Already a member" });

      await db.insert(groupMembers).values({
        groupId: input.groupId,
        userId: ctx.session.user.id,
      });

      return { success: true };
    }),

  leave: memberProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.groupMembers.findFirst({
         where: (gm, { eq, and }) => and(
           eq(gm.groupId, input.groupId),
           eq(gm.userId, ctx.session.user.id)
         )
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Not a member" });
      
      await db.delete(groupMembers).where(eq(groupMembers.id, existing.id));

      return { success: true };
    }),
});
