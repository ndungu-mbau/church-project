import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { groups } from "@church-project/db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const staffGroupsRouter = router({
  create: staffProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      leaderId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(groups).values({
        name: input.name,
        description: input.description,
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
        leaderId: input.leaderId || ctx.session.user.id, // Auto-assign creator as leader initially
      });
      return { success: true };
    }),

  update: staffProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      leaderId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       const group = await db.query.groups.findFirst({
         where: (g, { eq, and }) => and(
           eq(g.id, input.id),
           eq(g.churchId, ctx.session.churchId!)
         )
       });
       if (!group) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });

       if (group.createdBy !== ctx.session.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
       }

       const updates: any = {};
       if (input.name) updates.name = input.name;
       if (input.description) updates.description = input.description;
       if (input.leaderId) updates.leaderId = input.leaderId;

       await db.update(groups).set(updates).where(eq(groups.id, input.id));
      return { success: true };
    }),

  list: staffProcedure
    .query(async ({ ctx }) => {
       const items = await db.query.groups.findMany({
         where: (g, { eq }) => eq(g.churchId, ctx.session.churchId!),
       });
       return items;
    }),

  get: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
       const group = await db.query.groups.findFirst({
         where: (g, { eq, and }) => and(
           eq(g.id, input.id),
           eq(g.churchId, ctx.session.churchId!)
         )
       });
       if (!group) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
       return group;
    }),

  listMembers: staffProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      const members = await db.query.groupMembers.findMany({
        where: (gm, { eq }) => eq(gm.groupId, input.groupId),
        with: {
          user: true,
        }
      });
      return members;
    }),
});
