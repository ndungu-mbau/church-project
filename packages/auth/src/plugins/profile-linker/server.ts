import type { BetterAuthPlugin } from "better-auth";
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
          handler: async (ctx: any) => {
            let user = ctx.context?.newSession?.user;

            console.log({
              user,
              session: ctx.context.session,
            });

            // Fallback: Try to parse from response if not in context
            if (!user && ctx.response) {
               try {
                   const clone = ctx.response.clone();
                   const body = await clone.json();
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
          },
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};

async function linkProfileByEmail(userId: string, email: string) {
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      profiles: true,
    },
  });

  if (currentUser?.profiles?.churchId) {
    return;
  }

  const roleRank: Record<string, number> = {
    guest: 0,
    member: 1,
    staff: 2,
    pastor: 3,
    admin: 4,
    superadmin: 5,
  };

  const currentRole = currentUser?.role ?? "guest";
  let desiredRole = currentRole;

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

    if ((roleRank[desiredRole] ?? 0) < (roleRank.member ?? 1)) {
      desiredRole = "member";
    }
  }

  // 2. Find staff by email
  const staffMember = await db.query.staff.findFirst({
    where: eq(staff.email, email),
  });

  if (staffMember) {
    // Link Staff to User
    await db
      .update(staff)
      .set({ userId: userId })
      .where(eq(staff.id, staffMember.id));

    // Link Profile to User (if exists)
    if (staffMember.profileId) {
      await db
        .update(profiles)
        .set({ userId: userId })
        .where(eq(profiles.id, staffMember.profileId));
    } else {
      // Create empty profile for staff
      const [profile] = await db
        .insert(profiles)
        .values({
          id: crypto.randomUUID(),
          userId: userId,
        })
        .returning();

      await db
        .update(staff)
        .set({ profileId: profile?.id })
        .where(eq(staff.id, staffMember.id));
    }

    if ((roleRank[desiredRole] ?? 0) < (roleRank.staff ?? 2)) {
      desiredRole = "staff";
    }
  }

  if (desiredRole !== currentRole) {
    await db
      .update(user)
      .set({ role: desiredRole as any })
      .where(eq(user.id, userId));
  }
}
