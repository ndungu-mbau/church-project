import z from "zod";
import { router, publicProcedure, superuserProcedure } from "../trpc";
import { invites } from "@church-project/db/schema/invites";
import { eq } from "drizzle-orm";
import { db } from "@church-project/db";

export const invitesRouter = router({
  getAll: superuserProcedure.query(async () => {
    return await db.select().from(invites);
  }),

  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return await db.insert(invites).values({
        email: input.email,
      });
    }),

  delete: superuserProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await db.delete(invites).where(eq(invites.id, input.id));
    }),
});
