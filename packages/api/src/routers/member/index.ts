
import { router } from "../../trpc";
import { memberEventsRouter } from "./events";
import { memberGroupsRouter } from "./groups";
import { memberPrayerRequestsRouter } from "./prayer-requests";
import { memberProfileRouter } from "./profile";

export const memberRouter = router({
  events: memberEventsRouter,
  groups: memberGroupsRouter,
  prayerRequests: memberPrayerRequestsRouter,
  profile: memberProfileRouter,
});
