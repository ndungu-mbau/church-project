import { router, adminProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { church, churchInfo } from "@church-project/db/schema/churches";
import { eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const adminChurchRouter = router({
  update: adminProcedure
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      website: z.string().url().optional(),
      description: z.string().optional(),
      logo: z.string().optional(),
      facebookUrl: z.string().url().optional(),
      youtubeUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Update core church table
      const coreUpdates: any = {};
      if (input.name) coreUpdates.name = input.name;
      if (input.email) coreUpdates.email = input.email;
      if (input.phone) coreUpdates.phone = input.phone;
      if (input.address) coreUpdates.address = input.address;
      if (input.city) coreUpdates.city = input.city;
      if (input.country) coreUpdates.country = input.country;

      if (Object.keys(coreUpdates).length > 0) {
        await db.update(church)
          .set(coreUpdates)
          .where(eq(church.id, ctx.session.churchId!)); // adminProcedure ensures churchId
      }

      // Update or create churchInfo
      const infoUpdates: any = {};
      if (input.website) infoUpdates.website = input.website;
      if (input.description) infoUpdates.description = input.description;
      if (input.logo) infoUpdates.logo = input.logo;
      if (input.facebookUrl) infoUpdates.facebookUrl = input.facebookUrl;
      if (input.youtubeUrl) infoUpdates.youtubeUrl = input.youtubeUrl;

      if (Object.keys(infoUpdates).length > 0) {
        const existingInfo = await db.query.churchInfo.findFirst({
           where: (ci, { eq }) => eq(ci.churchId, ctx.session.churchId!)
        });

        if (existingInfo) {
           await db.update(churchInfo)
             .set(infoUpdates)
             .where(eq(churchInfo.id, existingInfo.id));
        } else {
           await db.insert(churchInfo).values({
             churchId: ctx.session.churchId!,
             ...infoUpdates
           });
        }
      }

      return { success: true };
    }),
});
