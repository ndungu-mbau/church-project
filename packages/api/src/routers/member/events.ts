import { router, memberProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@church-project/db";
import { events, eventRegistrations } from "@church-project/db";
import { eq, desc } from "drizzle-orm";

export const memberEventsRouter = router({
  list: memberProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.number().nullish(), // Changed to offset for simplicity or implement cursor properly later
    }))
    .query(async ({ ctx, input }) => {
       const items = await db.query.events.findMany({
         where: (event, { eq, and, gte }) => and(
            eq(event.churchId, ctx.session.churchId!),
            gte(event.startTime, new Date()) // Only show future events by default?
         ),
         limit: input.limit,
         orderBy: [desc(events.startTime)],
       });
       return items;
    }),

  get: memberProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
       const event = await db.query.events.findFirst({
         where: (event, { eq, and }) => and(
            eq(event.id, input.id),
            eq(event.churchId, ctx.session.churchId!)
         ),
         with: {
           church: true,
         }
       });
       
       if (!event) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
       }
       return event;
    }),

  register: memberProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if event exists and belongs to church
      const event = await db.query.events.findFirst({
         where: (event, { eq, and }) => and(
           eq(event.id, input.eventId),
           eq(event.churchId, ctx.session.churchId!)
         )
      });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      // Check if already registered
      const existing = await db.query.eventRegistrations.findFirst({
        where: (reg, { eq, and }) => and(
          eq(reg.eventId, input.eventId),
          eq(reg.userId, ctx.session.user.id)
        ),
      });

      if (existing) {
         throw new TRPCError({ code: "CONFLICT", message: "Already registered" });
      }

      await db.insert(eventRegistrations).values({
        eventId: input.eventId,
        userId: ctx.session.user.id,
      });

      return { success: true };
    }),

  cancelRegistration: memberProcedure
    .input(z.object({ registrationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.eventRegistrations.findFirst({
        where: (reg, { eq, and }) => and(
          eq(reg.id, input.registrationId),
          eq(reg.userId, ctx.session.user.id) // Ensure ownership
        )
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
      }

      await db.delete(eventRegistrations).where(eq(eventRegistrations.id, input.registrationId));
      return { success: true };
    }),

  myRegistrations: memberProcedure
    .query(async ({ ctx }) => {
      const registrations = await db.query.eventRegistrations.findMany({
        where: (reg, { eq }) => eq(reg.userId, ctx.session.user.id),
        with: {
          event: true,
        },
        orderBy: [desc(eventRegistrations.registeredAt)],
      });
      return registrations;
    }),
});
