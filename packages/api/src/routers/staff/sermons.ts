
import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { sermons } from "@church-project/db/schema/sermons";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const staffSermonsRouter = router({
  create: staffProcedure
    .input(z.object({
      title: z.string().min(1),
      videoUrl: z.string().url(),
      description: z.string().optional(),
      category: z.string().optional(),
      date: z.string().optional(), // ISO
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(sermons).values({
        title: input.title,
        link: input.videoUrl, // Map videoUrl to link
        content: input.description, // Map description to content?
        category: input.category,
        date: input.date ? new Date(input.date) : new Date(),
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
      });
      return { success: true };
    }),

  update: staffProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      videoUrl: z.string().url().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       const sermon = await db.query.sermons.findFirst({
         where: (s, { eq, and }) => and(
           eq(s.id, input.id),
           eq(s.churchId, ctx.session.churchId!)
         )
       });
       if (!sermon) throw new TRPCError({ code: "NOT_FOUND", message: "Sermon not found" });

       if (sermon.createdBy !== ctx.session.user.id && ctx.session.user.role !== "admin") {
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
       }

       const updates: any = {};
       if (input.title) updates.title = input.title;
       if (input.videoUrl) updates.link = input.videoUrl;
       if (input.description) updates.content = input.description;

       await db.update(sermons).set(updates).where(eq(sermons.id, input.id));
      return { success: true };
    }),

  delete: staffProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sermon = await db.query.sermons.findFirst({
         where: (s, { eq, and }) => and(
           eq(s.id, input.id),
           eq(s.churchId, ctx.session.churchId!)
         )
       });
       if (!sermon) throw new TRPCError({ code: "NOT_FOUND", message: "Sermon not found" });

       if (sermon.createdBy !== ctx.session.user.id && ctx.session.user.role !== "admin") {
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
       }

       await db.delete(sermons).where(eq(sermons.id, input.id));
      return { success: true };
    }),

  list: staffProcedure
    .query(async ({ ctx }) => {
       const items = await db.query.sermons.findMany({
         where: (s, { eq }) => eq(s.churchId, ctx.session.churchId!),
         orderBy: [desc(sermons.date)],
       });
       return items;
    }),
});
