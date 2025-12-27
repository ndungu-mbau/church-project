import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { members } from "@church-project/db/schema/members";
import { profiles } from "@church-project/db/schema/profiles";
import { user } from "@church-project/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminMembersRouter = router({
  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingInChurch = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.churchId, ctx.session.churchId!), eq(m.email, input.email)),
      });
      if (existingInChurch) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Member already exists in this church",
        });
      }

      const existingUser = await db.query.user.findFirst({
        where: (u, { eq }) => eq(u.email, input.email),
      });

      const [profile] = await db
        .insert(profiles)
        .values({
          userId: existingUser?.id ?? (null as any),
          phone: input.phone,
          churchId: ctx.session.churchId!,
        })
        .returning();

      const [member] = await db
        .insert(members)
        .values({
          userId: existingUser?.id ?? (null as any),
          profileId: profile?.id ?? (null as any),
          churchId: ctx.session.churchId!,
          email: input.email,
        })
        .returning();

      return member;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const memberRecord = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.churchId, ctx.session.churchId!)),
        with: { profile: true },
      });
      if (!memberRecord)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

      if (input.email) {
        await db
          .update(members)
          .set({ email: input.email })
          .where(eq(members.id, input.id));
      }
      if (input.phone) {
        await db
          .update(profiles)
          .set({ phone: input.phone })
          .where(eq(profiles.id, memberRecord.profileId!));
      }

      const updated = await db.query.members.findFirst({
        where: (m, { eq }) => eq(m.id, input.id),
        with: { user: true, profile: true },
      });
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const memberRecord = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.churchId, ctx.session.churchId!)),
      });
      if (!memberRecord)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

      await db.delete(members).where(eq(members.id, input.id));
      return { success: true };
    }),

  list: adminProcedure.query(async ({ ctx }) => {
    const items = await db.query.members.findMany({
      where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
      with: {
        user: true,
        profile: true,
      },
    });
    return items;
  }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.churchId, ctx.session.churchId!)),
        with: {
          user: true,
          profile: true,
        },
      });
      if (!item)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      return item;
    }),
});
