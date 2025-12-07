
import { router, superuserProcedure } from "../../trpc";
// import { z } from "zod";
// import { db } from "@church-project/db";

export const superuserSubscriptionsRouter = router({
  listAll: superuserProcedure
    .query(async ({ ctx: _ctx }) => {
      // List all subscriptions for all churches
      // const allSubs = await db.query.churchSubscription.findMany({ ... });
      // Placeholder
      return [];
    }),

  checkStatus: superuserProcedure
    .query(async ({ ctx: _ctx }) => {
        // Check stripe status sync
        return { status: "ok" };
    }),
});
