import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
import { db } from "@church-project/db";
import { members } from "@church-project/db/schema/members";
import { profiles } from "@church-project/db/schema/profiles";
import { eq } from "drizzle-orm";
import type { Platform } from "../platform-detector/server";

export const mobileAuthPlugin = () => {
  return {
    id: "mobile-auth",
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

            // Only run for mobile registrations (optional: can also run for all)
            // Remove this check if you want guest creation for all platforms
            if (platform !== "mobile") {
              return;
            }

            let user = ctx.context?.newSession?.user;

            if (!user && (ctx as any).body) {
              try {
                const body: any = (ctx as any).body;
                if (body?.user) {
                  user = body.user;
                } else if (body?.data?.user) {
                  user = body.data.user;
                }
              } catch (e) {}
            }

            if (!user) {
              return ctx;
            }

            // Check if user already has a linked member record
            const existingMember = await db.query.members.findFirst({
              where: eq(members.userId, user.id),
            });

            if (existingMember) {
              // Already linked, no need to create guest
              return ctx;
            }

            // Check if profile-linker already linked via email
            const linkedByEmail = await db.query.members.findFirst({
              where: eq(members.email, user.email),
            });

            if (linkedByEmail) {
              // Will be/was handled by profile-linker
              return ctx;
            }

            console.log({
              user,
              session: ctx.context.session,
            });

            // Create empty profile for guest
            const [newProfile] = await db
              .insert(profiles)
              .values({
                userId: user.id,
                // Empty profile - no details yet
              })
              .returning();

            // Create empty member record (guest member - no church assignment)
            await db.insert(members).values({
              userId: user.id,
              profileId: newProfile?.id,
              email: user.email,
              // No churchId means "Global Church" / unassigned
            });

            // User role is already 'guest' by default from better-auth config

            return ctx.json({
              user,
              session: ctx.context.session,
            });
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
