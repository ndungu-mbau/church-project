import { router, superuserProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { church } from "@church-project/db";
import { eq, desc } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const superuserChurchesRouter = router({
  list: superuserProcedure
    .query(async ({ ctx: _ctx }) => {
       const items = await db.query.church.findMany({
         orderBy: [desc(church.createdAt)],
         with: {
           info: true
         }
       });
       return items;
    }),

  get: superuserProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: _ctx, input }) => {
       const item = await db.query.church.findFirst({
         where: (c, { eq }) => eq(c.id, input.id),
         with: {
           info: true,
           pastor: true,
         }
       });
       return item;
    }),

  create: superuserProcedure
    .input(z.object({
      name: z.string().min(1),
      churchId: z.string().min(1), // Unique slug/ID
      email: z.string().email(),
      phone: z.string().min(1),
      country: z.string(),
      // Pastor email? To invite?
      // For now basic church info
    }))
    .mutation(async ({ ctx: _ctx, input }) => {
      // Check duplicate churchId?
      // db constraint will catch it, or check manually.
      
      const newChurch = await db.insert(church).values({
        churchId: input.churchId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        country: input.country,
      }).returning({ id: church.id });
      
      if (!newChurch[0]) throw new Error("Failed to create church");
      return { success: true, id: newChurch[0].id };
    }),

  deactivate: superuserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: _ctx, input }) => {
       await db.update(church)
         .set({ isActive: false })
         .where(eq(church.id, input.id));
       return { success: true };
    }),

  reactivate: superuserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: _ctx, input }) => {
       await db.update(church)
         .set({ isActive: true })
         .where(eq(church.id, input.id));
       return { success: true };
    }),

   impersonate: superuserProcedure
    .input(z.object({ churchId: z.string() }))
     .mutation(async ({ ctx: _ctx, input: _input }) => {
       // Placeholder for impersonation logic
       // Need to implement auth swap logic
       return { success: true, token: "mock-token" }; 
     }),
});
