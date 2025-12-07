import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { sermons } from "@church-project/db/schema/sermons";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminSermonsRouter = router({
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      videoUrl: z.string().url(),
      description: z.string().optional(),
      category: z.string().optional(),
      date: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(sermons).values({
        title: input.title,
        link: input.videoUrl,
        content: input.description,
        category: input.category,
        date: input.date ? new Date(input.date) : new Date(),
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
      });
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      videoUrl: z.string().url().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       // Ensure sermon belongs to this church
       const sermon = await db.query.sermons.findFirst({
         where: (s, { eq, and }) => and(
           eq(s.id, input.id),
           eq(s.churchId, ctx.session.churchId!)
         )
       });
       if (!sermon) throw new TRPCError({ code: "NOT_FOUND", message: "Sermon not found" });

       const updates: any = {};
       if (input.title) updates.title = input.title;
       if (input.videoUrl) updates.link = input.videoUrl;
       if (input.description) updates.content = input.description;

       await db.update(sermons).set(updates).where(eq(sermons.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure belongs to church
       const deleted = await db.delete(sermons)
         .where(and(
           eq(sermons.id, input.id),
           eq(sermons.churchId, ctx.session.churchId!)
         ))
         .returning({ id: sermons.id });
       
       if (deleted.length === 0) {
         throw new TRPCError({ code: "NOT_FOUND", message: "Sermon not found" });
       }
      return { success: true };
    }),
});
