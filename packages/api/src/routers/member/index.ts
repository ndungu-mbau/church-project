import { router } from "../../trpc";
import { memberEventsRouter } from "./events";
import { memberGroupsRouter } from "./groups";
import { memberPrayerRequestsRouter } from "./prayer-requests";
import { memberProfileRouter } from "./profile";
import { memberSermonsRouter } from "./sermons";
import { memberDevotionsRouter } from "./daily-devotions";
import { memberNotificationsRouter } from "./notifications";

export const memberRouter = router({
  events: memberEventsRouter,
  groups: memberGroupsRouter,
  prayerRequests: memberPrayerRequestsRouter,
  profile: memberProfileRouter,
  sermons: memberSermonsRouter,
  devotions: memberDevotionsRouter,
  notifications: memberNotificationsRouter,
});
