import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
// import { staff } from "@church-project/db/schema/staff";
// import { eq } from "drizzle-orm"; // Unused if we only use query builder shorthand? No, might need it.
import { TRPCError } from "@trpc/server";

export const staffMembersRouter = router({
  list: staffProcedure
    .query(async ({ ctx }) => {
      const items = await db.query.members.findMany({
        where: (m, { eq }) => eq(m.churchId, ctx.session.churchId!),
        with: {
          user: {
             with: {
               profiles: true,
             }
          },
          // profile: true, // members table has profileId, but maybe loop via user is better or direct profileId?
          // members.ts has relations: user, profile, church.
        }
      });
      return items;
    }),

  get: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) => and(
          eq(m.id, input.id),
          eq(m.churchId, ctx.session.churchId!)
         ),
        with: {
          user: {
            with: {
              profiles: true,
            }
          },
          profile: true,
        }
      });
      if (!member) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      return member;
    }),
});
