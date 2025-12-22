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
            // Match sign-in related paths
            return (
              ctx.path.includes("/sign-in") || ctx.path.includes("/callback")
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const platform = (ctx as any).platform as Platform;

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

            if (user && (user.role === "member" || user.role === "guest")) {
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
