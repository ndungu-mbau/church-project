import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins"
import { db } from "@church-project/db";
import { members } from "@church-project/db/schema/members";
import { profiles } from "@church-project/db/schema/profiles";
import { eq } from "drizzle-orm";

export const profileLinkerPlugin = () => {
  return {
    id: "profile-linker",
    hooks: {
      after: [
        {
          matcher: (ctx) => {
            return ctx.path.includes("/sign-up") || ctx.path.includes("/callback");
          },
          handler: createAuthMiddleware(async (ctx) => {
            let user = ctx.context?.newSession?.user;

            // Fallback: Try to parse from response if not in context
            if (!user && ctx.body) {
               try {
                   const body = ctx.body;
                   if (body?.user) {
                       user = body.user;
                   } else if (body?.data?.user) { // handling potential wrapper
                        user = body.data.user;
                   }
               } catch (e) {
                   // ignore json parse error
               }
            }

            if (!user || !user.email) {
              return;
            }

            try {
                await linkProfileByEmail(user.id, user.email);
            } catch (error) {
                console.error("Failed to link profile:", error);
            }
            
            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};

async function linkProfileByEmail(userId: string, email: string) {
  console.log({ userId, email });
  // 1. Find member by email
  const member = await db.query.members.findFirst({
    where: eq(members.email, email),
  });

  if (!member) return;

  // 2. Link Member to User
  // If the member already has a user ID, we might be overwriting it, or it might be null.
  // Assuming strict claiming, we update it.
  await db.update(members)
      .set({ userId: userId })
      .where(eq(members.id, member.id));

  // 3. Link Profile to User (if exists)
  if (member.profileId) {
    // We only update if the profile doesn't have a user ID yet,
    // OR if we assume this is the definitive claiming action.
    // Given the task, we want to assign the user.
    await db.update(profiles)
        .set({ userId: userId })
        .where(eq(profiles.id, member.profileId));
  }
}
