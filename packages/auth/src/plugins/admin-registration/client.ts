import type { BetterAuthClientPlugin } from "better-auth";
import type { adminRegistrationPlugin } from "./server";

export const adminRegistrationClient = () => {
  return {
    id: "admin-registration",
    $InferServerPlugin: {} as ReturnType<typeof adminRegistrationPlugin>,
  } satisfies BetterAuthClientPlugin;
};
