import type { BetterAuthPlugin } from "better-auth";
import { db } from "@church-project/db";
import { church } from "@church-project/db/schema/churches";
import { profiles } from "@church-project/db/schema/profiles";
import { staff } from "@church-project/db/schema/staff";
import { user } from "@church-project/db/schema/auth";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { createAuthMiddleware } from "better-auth/plugins";

export const adminRegistrationPlugin = () => {
  return {
    id: "admin-registration",
    hooks: {
      before: [
        {
          matcher: (ctx) => ctx.path.endsWith("/sign-up/email"),
          handler: createAuthMiddleware(async (ctx) => {
            const isRegistering = ctx.body?.isRegistering;
            return {
              context: {
                ...ctx,
                isRegistering: !!isRegistering,
              },
            };
          }),
        },
      ],
      after: [
        {
          matcher: (ctx) => ctx.path.endsWith("/sign-up/email"),
          handler: createAuthMiddleware(async (ctx) => {
            const isRegistering = (ctx as any).body?.isRegistering;
            const user = ctx.context?.newSession?.user;
            if (isRegistering && user) {
              await initializeAdminFlow(user.id, user.name, user.email);
            }
            return ctx;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};

export async function initializeAdminFlow(
  userId: string,
  userName: string,
  userEmail: string
) {
  // 2. Create a new church entity
  const churchIdSlug = `church-${crypto.randomUUID().slice(0, 8)}`;

  const [newChurch] = await db
    .insert(church)
    .values({
      churchId: churchIdSlug,
      name: `${userName}'s Church`,
      email: userEmail,
      phone: "Pending",
      country: "Kenya",
      adminId: userId,
    })
    .returning();

  if (!newChurch) {
    throw new Error("Failed to create church during admin registration");
  }

  await db.insert(profiles).values({
    userId: userId,
    churchId: newChurch.id,
  });

  // 4. Create Staff record (Admin Entity)
  await db.insert(staff).values({
    userId: userId,
    churchId: newChurch.id,
    position: "Administrator",
    startDate: new Date(),
    isActive: true,
    email: userEmail,
  });

  // 5. Update User role
  await db.update(user).set({ role: "admin" }).where(eq(user.id, userId));

  console.log(
    `Successfully initialized admin flow for user ${userId} with church ${newChurch.id}`
  );
}
