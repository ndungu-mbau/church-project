import { router, adminProcedure } from "../../trpc";
// import { z } from "zod";
// import { db } from "@church-project/db";
// import { churchSubscription } from "@church-project/db/schema/subscriptions";
// import { eq } from "drizzle-orm";

export const adminSubscriptionsRouter = router({
  manage: adminProcedure
    .mutation(async ({ ctx: _ctx }) => {
      // Return a URL to Stripe Customer Portal?
      // Or just status?
      // For now, return a placeholder URL or message.
      // This usually involves calling stripe API to create session.
      return { url: "https://billing.stripe.com/p/session/test" }; 
    }),
});
