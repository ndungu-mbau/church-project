
import { router } from "../../trpc";
import { staffEventsRouter } from "./events";
import { staffGroupsRouter } from "./groups";
import { staffDevotionsRouter } from "./devotions";
import { staffMembersRouter } from "./members";
import { staffPrayerRequestsRouter } from "./prayer-requests";
import { staffSermonsRouter } from "./sermons";

export const staffRouter = router({
  events: staffEventsRouter,
  groups: staffGroupsRouter,
  devotions: staffDevotionsRouter,
  members: staffMembersRouter,
  prayerRequests: staffPrayerRequestsRouter,
  sermons: staffSermonsRouter,
});
