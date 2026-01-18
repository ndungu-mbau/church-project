import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";

export type Platform = "mobile" | "web" | "unknown";

export const platformDetectorPlugin = () => {
  return {
    id: "platform-detector",
    hooks: {
      before: [
        {
          matcher: () => true, // Match all requests
          handler: createAuthMiddleware(async (ctx) => {
            // Detect platform from headers
            const userAgent = ctx.headers?.get("user-agent") || "";
            const xPlatform = ctx.headers?.get("x-platform"); // Custom header from clients

            let platform: Platform = "unknown";

            if (xPlatform === "mobile" || xPlatform === "expo") {
              platform = "mobile";
            } else if (xPlatform === "web") {
              platform = "web";
            } else if (
              userAgent.includes("Expo") ||
              userAgent.includes("okhttp")
            ) {
              platform = "mobile";
            } else if (
              userAgent.includes("Mozilla") ||
              userAgent.includes("Chrome")
            ) {
              platform = "web";
            } else {
              platform = "mobile";
            }

            // Attach platform to context for downstream plugins
            return {
              context: {
                ...ctx,
                platform,
              },
            };
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
