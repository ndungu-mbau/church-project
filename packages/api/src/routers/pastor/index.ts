
import { router } from "../../trpc";
import { pastorDevotionsRouter } from "./devotions";
import { pastorPrayerRequestsRouter } from "./prayer-requests";

export const pastorRouter = router({
  devotions: pastorDevotionsRouter,
  prayerRequests: pastorPrayerRequestsRouter,
});
