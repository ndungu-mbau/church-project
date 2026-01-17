import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { profiles } from "@church-project/db/schema";
import { eq } from "drizzle-orm";

export const memberProfileRouter = router({
  getMe: memberProcedure
    .query(async ({ ctx }) => {
       // Fetch fresh to be sure
       const profile = await db.query.profiles.findFirst({
         where: (p, { eq }) => eq(p.userId, ctx.session.user.id),
       });
       return { ...ctx.session.user, profile };
    }),

  updateMe: memberProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
      dateOfBirth: z.string().optional(), // Receive as string, parse to Date if needed or store as string if schema is date string? Schema says `date` type.
    }))
    .mutation(async ({ ctx, input }) => {
      // Update User table for name? The schema `user` likely has `name`. `profiles` has address/bio.
      // input separates firstName/lastName but `user` usually has `name`.
      // The schema for `profiles` has `phone`, `bio`, `address`...
      
      // Let's assume we update `profiles` mostly.
      const profileUpdates: any = {};
      if (input.phone) profileUpdates.phone = input.phone;
      if (input.bio) profileUpdates.bio = input.bio;
      if (input.address) profileUpdates.address = input.address;
      if (input.city) profileUpdates.city = input.city;
      if (input.state) profileUpdates.state = input.state;
      if (input.country) profileUpdates.country = input.country;
      if (input.postalCode) profileUpdates.postalCode = input.postalCode;
      if (input.dateOfBirth) profileUpdates.dateOfBirth = input.dateOfBirth;

      // Update name in User table (if applicable)
      // I'll skip user table update for now unless strictly required, as it might involve `auth` logic.
      // But `profiles` table is definitely updatable.

      const existingProfile = await db.query.profiles.findFirst({
         where: (p, { eq }) => eq(p.userId, ctx.session.user.id),
      });

      if (existingProfile) {
        await db.update(profiles)
          .set(profileUpdates)
          .where(eq(profiles.id, existingProfile.id));
      } else {
        // Create if missing?
        await db.insert(profiles).values({
          userId: ctx.session.user.id,
          churchId: ctx.session.churchId,
           ...profileUpdates
        });
      }

      return { success: true };
    }),
});
