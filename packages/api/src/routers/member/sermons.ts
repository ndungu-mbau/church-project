import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { sermons } from "@church-project/db/schema/sermons";
import { desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const memberSermonsRouter = router({
  list: memberProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await db.query.sermons.findMany({
        where: (s, { eq }) => eq(s.churchId, ctx.session.churchId!),
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(sermons.date)],
      });
      return items;
    }),

  get: memberProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const sermon = await db.query.sermons.findFirst({
        where: (s, { eq, and }) =>
          and(eq(s.id, input.id), eq(s.churchId, ctx.session.churchId!)),
      });

      if (!sermon) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sermon not found" });
      }
      return sermon;
    }),

  latest: memberProcedure.query(async ({ ctx }) => {
    const sermon = await db.query.sermons.findFirst({
      where: (s, { eq }) => eq(s.churchId, ctx.session.churchId!),
      orderBy: [desc(sermons.date)],
    });
    return sermon;
  }),
});
