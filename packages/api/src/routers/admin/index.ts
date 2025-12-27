import { router } from "../../trpc";
import { adminChurchRouter } from "./church";
import { adminStaffRouter } from "./staff";
import { adminSermonsRouter } from "./sermons";
import { adminSubscriptionsRouter } from "./subscriptions";
import { adminMembersRouter } from "./members";

export const adminRouter = router({
  church: adminChurchRouter,
  staff: adminStaffRouter,
  sermons: adminSermonsRouter,
  subscriptions: adminSubscriptionsRouter,
  members: adminMembersRouter,
});
