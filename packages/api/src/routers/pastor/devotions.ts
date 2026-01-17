
import { router, pastorProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { dailyDevotions } from "@church-project/db/schema/daily-devotions";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const pastorDevotionsRouter = router({
  create: pastorProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      date: z.string(), // ISO String
      link: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(dailyDevotions).values({
        title: input.title,
        content: input.content,
        date: new Date(input.date),
        link: input.link,
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
      });
      return { success: true };
    }),

  update: pastorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      link: z.string().optional(),
      date: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       const devotion = await db.query.dailyDevotions.findFirst({
         where: (d, { eq, and }) => and(
           eq(d.id, input.id),
           eq(d.churchId, ctx.session.churchId!)
         )
       });

       if (!devotion) throw new TRPCError({ code: "NOT_FOUND", message: "Devotion not found" });

       if (devotion.createdBy !== ctx.session.user.id) { // Pastor can only edit own? Workflow said "Own".
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
       }

       const updates: any = {};
       if (input.title) updates.title = input.title;
       if (input.content) updates.content = input.content;
       if (input.link) updates.link = input.link;
       if (input.date) updates.date = new Date(input.date);

       await db.update(dailyDevotions).set(updates).where(eq(dailyDevotions.id, input.id));
      return { success: true };
    }),

  delete: pastorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const devotion = await db.query.dailyDevotions.findFirst({
         where: (d, { eq, and }) => and(
           eq(d.id, input.id),
           eq(d.churchId, ctx.session.churchId!)
         )
       });

       if (!devotion) throw new TRPCError({ code: "NOT_FOUND", message: "Devotion not found" });

       if (devotion.createdBy !== ctx.session.user.id) {
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
       }
      
      await db.delete(dailyDevotions).where(eq(dailyDevotions.id, input.id));
      return { success: true };
    }),
  list: pastorProcedure
    .query(async ({ ctx }) => {
       // Pastor sees all devotions, but UI might highlight theirs? 
       // Or filtering by createdBy can be done in frontend.
       const items = await db.query.dailyDevotions.findMany({
         where: (d, { eq }) => eq(d.churchId, ctx.session.churchId!),
         orderBy: [desc(dailyDevotions.date)],
       });
       return items;
    }),

  get: pastorProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
       const devotion = await db.query.dailyDevotions.findFirst({
         where: (d, { eq, and }) => and(
           eq(d.id, input.id),
           eq(d.churchId, ctx.session.churchId!)
         )
       });
       if (!devotion) throw new TRPCError({ code: "NOT_FOUND", message: "Devotion not found" });
       return devotion;
    }),
});
