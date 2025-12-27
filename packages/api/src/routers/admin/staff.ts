import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { staff } from "@church-project/db/schema/staff";
import { profiles } from "@church-project/db/schema/profiles";
import { user } from "@church-project/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminStaffRouter = router({
  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["staff", "pastor", "admin"]),
        position: z.string(),
        department: z.string().optional(),
        // Bio props below
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

      const existingStaffByEmail = await db.query.staff.findFirst({
        where: (s, { eq, and }) =>
          and(eq(s.email, input.email), eq(s.churchId, ctx.session.churchId!)),
      });

      if (existingStaffByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "A staff record with this email already exists in this church.",
        });
      }

      const existingStaff = targetUser
        ? await db.query.staff.findFirst({
            where: (s, { eq, and }) =>
              and(
                eq(s.userId, targetUser.id),
                eq(s.churchId, ctx.session.churchId!)
              ),
          })
        : null;

      if (existingStaff) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already staff in this church.",
        });
      }

      if (targetUser) {
        await db
          .update(user)
          .set({ role: input.role })
          .where(eq(user.id, targetUser.id));
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

      await db.insert(staff).values({
        userId: targetUser?.id ?? null,
        email: input.email,
        position: input.position,
        department: input.department,
        startDate: new Date(),
        profileId: profile?.id ?? null,
        churchId: ctx.session.churchId!,
      });

      return { success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(), // staff id
        position: z.string().optional(),
        department: z.string().optional(),
        role: z.enum(["staff", "pastor", "admin"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const staffRecord = await db.query.staff.findFirst({
        where: (s, { eq, and }) =>
          and(eq(s.id, input.id), eq(s.churchId, ctx.session.churchId!)),
      });
      if (!staffRecord)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Staff record not found",
        });

      const updates: any = {};
      if (input.position) updates.position = input.position;
      if (input.department) updates.department = input.department;
      if (input.isActive !== undefined) updates.isActive = input.isActive;

      if (Object.keys(updates).length > 0) {
        await db.update(staff).set(updates).where(eq(staff.id, input.id));
      }

      if (input.role) {
        // Update user role
        await db
          .update(user)
          .set({ role: input.role as any })
          .where(eq(user.id, staffRecord.userId!));
      }

      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete staff record. Downgrade user role?
      // Usually we don't downgrade automatically as they might be admin in another church?
      // Just remove staff record.

      await db
        .delete(staff)
        .where(
          and(eq(staff.id, input.id), eq(staff.churchId, ctx.session.churchId!))
        );

      return { success: true };
    }),

  list: adminProcedure.query(async ({ ctx }) => {
    const items = await db.query.staff.findMany({
      where: (s, { eq }) => eq(s.churchId, ctx.session.churchId!),
      with: {
        user: true, // Fetch user details
      },
    });
    return items;
  }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await db.query.staff.findFirst({
        where: (s, { eq, and }) =>
          and(eq(s.id, input.id), eq(s.churchId, ctx.session.churchId!)),
        with: { user: true },
      });
      if (!item)
        throw new TRPCError({ code: "NOT_FOUND", message: "Staff not found" });
      return item;
    }),
});
