import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { dailyDevotions } from "@church-project/db/schema/daily-devotions";
import { desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const memberDevotionsRouter = router({
  list: memberProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await db.query.dailyDevotions.findMany({
        where: (d, { eq }) => eq(d.churchId, ctx.session.churchId!),
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(dailyDevotions.date)],
      });
      return items;
    }),

  get: memberProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const devotion = await db.query.dailyDevotions.findFirst({
        where: (d, { eq, and }) =>
          and(eq(d.id, input.id), eq(d.churchId, ctx.session.churchId!)),
      });

      if (!devotion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Devotion not found",
        });
      }
      return devotion;
    }),

  today: memberProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const devotion = await db.query.dailyDevotions.findFirst({
      where: (d, { eq, and, gte, lt }) =>
        and(
          eq(d.churchId, ctx.session.churchId!),
          gte(d.date, today),
          lt(d.date, tomorrow)
        ),
      orderBy: [desc(dailyDevotions.date)],
    });
    return devotion;
  }),
});
