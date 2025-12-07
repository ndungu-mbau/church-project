
import { router } from "../../trpc";
import { superuserChurchesRouter } from "./churches";
import { superuserSubscriptionsRouter } from "./subscriptions";

export const superuserRouter = router({
  churches: superuserChurchesRouter,
  subscriptions: superuserSubscriptionsRouter,
});
