
import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { prayerRequests } from "@church-project/db/schema/prayer-requests";
import { desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const staffPrayerRequestsRouter = router({
  list: staffProcedure
    .query(async ({ ctx }) => {
      const items = await db.query.prayerRequests.findMany({
        where: (pr, { eq }) => eq(pr.churchId, ctx.session.churchId!),
        with: {
          user: {
            with: { // user here refers to 'members' relation in schema!
              user: true, // This gets the actual auth user from member
            }
          }
        },
        orderBy: [desc(prayerRequests.submittedAt)],
      });
      return items;
    }),

  view: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const request = await db.query.prayerRequests.findFirst({
        where: (pr, { eq, and }) => and(
          eq(pr.id, input.id),
          eq(pr.churchId, ctx.session.churchId!)
        ),
         with: {
          user: {
            with: {
              user: true,
            }
          }
        },
      });
      if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "Prayer request not found" });
      return request;
    }),
});
