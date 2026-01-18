import type { BetterAuthPlugin } from "better-auth";
import { APIError } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/plugins";
import type { Platform } from "../platform-detector/server";

// Toggle: Set to false to allow members on web
const REJECT_MEMBERS_ON_WEB = true;

export const webAuthPlugin = () => {
  return {
    id: "web-auth",
    hooks: {
      after: [
        {
          matcher: (ctx) => {
            const p = ctx.path || "";
            return (
              p.includes("/sign-up") ||
              p.includes("/sign-in") ||
              p.includes("/register") ||
              p.includes("/callback")
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const platform = (ctx as any).platform as Platform;

            console.log({
              user: ctx.context.newSession?.user,
              session: ctx.context.session,
            });
            // Only enforce on web platform
            if (platform !== "web") {
              return;
            }

            // Check if toggle is enabled
            if (!REJECT_MEMBERS_ON_WEB) {
              return;
            }
            // Get user from session/response
            const user = ctx.context?.newSession?.user;
            const isRegistering = (ctx as any).context.returned?.isRegistering;

            if (
              user &&
              (user.role === "member" || user.role === "guest") &&
              !isRegistering
            ) {
              throw new APIError("FORBIDDEN", {
                message:
                  "Members cannot access the web dashboard. Please use the mobile app.",
              });
            }

            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
