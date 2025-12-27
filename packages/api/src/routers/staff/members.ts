import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { members } from "@church-project/db/schema/members";
import { profiles } from "@church-project/db/schema/profiles";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const staffMembersRouter = router({
  create: staffProcedure
    .input(
      z.object({
        email: z.string().email(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        dateOfBirth: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const targetUser = await db.query.user.findFirst({
        where: (u, { eq }) => eq(u.email, input.email),
      });

      const existingMemberByEmail = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.email, input.email), eq(m.churchId, ctx.session.churchId!)),
      });

      if (existingMemberByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "A member record with this email already exists in this church.",
        });
      }

      const existingMember = targetUser
        ? await db.query.members.findFirst({
            where: (m, { eq, and }) =>
              and(
                eq(m.userId, targetUser.id),
                eq(m.churchId, ctx.session.churchId!)
              ),
          })
        : null;

      if (existingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member in this church.",
        });
      }

      const dateOfBirth = input.dateOfBirth
        ? input.dateOfBirth.toISOString().slice(0, 10)
        : undefined;

      const profileValues: Partial<typeof profiles.$inferInsert> = {
        phone: input.phone,
        bio: input.bio,
        address: input.address,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        dateOfBirth,
        churchId: ctx.session.churchId!,
      };

      let profile: typeof profiles.$inferSelect | undefined;

      if (targetUser) {
        const existingProfile = await db.query.profiles.findFirst({
          where: (p, { eq }) => eq(p.userId, targetUser.id),
        });

        if (existingProfile) {
          const [updated] = await db
            .update(profiles)
            .set(profileValues)
            .where(eq(profiles.id, existingProfile.id))
            .returning();
          profile = updated;
        } else {
          const [created] = await db
            .insert(profiles)
            .values({
              userId: targetUser.id,
              ...profileValues,
            })
            .returning();
          profile = created;
        }
      } else {
        const [created] = await db
          .insert(profiles)
          .values({
            userId: null,
            ...profileValues,
          })
          .returning();
        profile = created;
      }

      const [member] = await db
        .insert(members)
        .values({
          userId: targetUser?.id ?? null,
          profileId: profile?.id ?? null,
          churchId: ctx.session.churchId!,
          email: input.email,
        })
        .returning();

      return member;
    }),

  list: staffProcedure.query(async ({ ctx }) => {
    const items = await db.query.members.findMany({
      where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
      with: {
        user: {
          with: {
            profiles: true,
          },
        },
        // profile: true, // members table has profileId, but maybe loop via user is better or direct profileId?
        // members.ts has relations: user, profile, church.
      },
    });
    return items;
  }),

  get: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.churchId, ctx.session.churchId!)),
        with: {
          user: {
            with: {
              profiles: true,
            },
          },
          profile: true,
        },
      });
      if (!member)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      return member;
    }),
});
