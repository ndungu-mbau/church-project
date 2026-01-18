import type { BetterAuthPlugin } from "better-auth";
import { db } from "@church-project/db";
import { church } from "@church-project/db/schema/churches";
import { profiles } from "@church-project/db/schema/profiles";
import { staff } from "@church-project/db/schema/staff";
import { user } from "@church-project/db/schema/auth";
import { eq, and, ilike } from "drizzle-orm";
import {
  subscriptionPlan,
  churchSubscription,
} from "@church-project/db/schema/subscriptions";

import random from "randomatic";

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
  userEmail: string,
) {
  // 2. Create a new church entity
  const churchIdSlug = random("A0", 6)
    .split("")
    .reduce((prev, char, i) => {
      return `${prev}${i === 3 ? "-" : ""}${char}`;
    }, "");

  console.log({ churchIdSlug });

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

  // 6. Assign Demo Subscription
  const [demoPlan] = await db
    .select()
    .from(subscriptionPlan)
    .where(
      and(
        ilike(subscriptionPlan.name, "demo"),
        eq(subscriptionPlan.price, "0.00"),
      ),
    )
    .limit(1);

  if (demoPlan) {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    await db.insert(churchSubscription).values({
      churchId: newChurch.id,
      planId: demoPlan.id,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthFromNow,
    });
    console.log(`Assigned demo subscription to church ${newChurch.id}`);
  } else {
    console.warn("Demo subscription plan not found. Skipping assignment.");
  }

  console.log(
    `Successfully initialized admin flow for user ${userId} with church ${newChurch.id}`,
  );
}
