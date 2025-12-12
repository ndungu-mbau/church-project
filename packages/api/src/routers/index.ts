
import { router } from "../trpc";
import { memberRouter } from "./member";
import { staffRouter } from "./staff";
import { pastorRouter } from "./pastor";
import { adminRouter } from "./admin";
import { invitesRouter } from "./invites";

export const appRouter = router({
  member: memberRouter,
  staff: staffRouter,
  pastor: pastorRouter,
  admin: adminRouter,
  invites: invitesRouter,
});

export type AppRouter = typeof appRouter;
