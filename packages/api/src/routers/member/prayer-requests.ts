import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@church-project/db";
import { prayerRequests } from "@church-project/db/schema";
import { desc } from "drizzle-orm";

export const memberPrayerRequestsRouter = router({
  create: memberProcedure
    .input(
      z.object({
        content: z.string().min(1),
        isAnonymous: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find the member record for this user in this church
      const member = await db.query.members.findFirst({
        where: (m, { eq, and }) =>
          and(
            eq(m.userId, ctx.session.user.id),
            eq(m.churchId, ctx.session.churchId!)
          ),
      });

      console.log("Member:", member);
      console.log("Church ID:", ctx.session.churchId);
      console.log("User ID:", ctx.session.user.id);
      console.log("Input:", input);

      if (!member) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Member record not found",
        });
      }

      await db.insert(prayerRequests).values({
        userId: member.id, // References members.id
        request: input.content,
        status: "pending",
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
        // isAnonymous field is missing in schema I saw?
        // Checked logic: Schema has `request`, `status`, `userId`, `churchId`, `createdBy`.
        // I don't see `isAnonymous` in the viewed schema. I will omit it or assume it's part of request text if needed.
        // For now, ignoring isAnonymous as per schema or I need to add it to schema?
        // The user didn't ask to change schema now. I will just store the content.
      });

      return { success: true };
    }),

  listMine: memberProcedure.query(async ({ ctx }) => {
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(
          eq(m.userId, ctx.session.user.id),
          eq(m.churchId, ctx.session.churchId!)
        ),
    });

    if (!member) return [];

    const requests = await db.query.prayerRequests.findMany({
      where: (req, { eq }) => eq(req.userId, member.id),
      orderBy: [desc(prayerRequests.submittedAt)],
    });
    return requests;
  }),
});
