
import { router, publicProcedure } from "../trpc";
import { memberRouter } from "./member";
import { staffRouter } from "./staff";
import { pastorRouter } from "./pastor";
import { adminRouter } from "./admin";
import { invitesRouter } from "./invites";

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => {
    await new Promise((done) => setTimeout(done, 5000));
    return "OK";
  }),
  member: memberRouter,
  staff: staffRouter,
  pastor: pastorRouter,
  admin: adminRouter,
  invites: invitesRouter,
});

export type AppRouter = typeof appRouter;
