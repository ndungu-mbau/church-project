
import { router, staffProcedure } from "../../trpc";
import { z } from "zod";
import { db } from "@church-project/db";
import { events, eventRegistrations } from "@church-project/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const staffEventsRouter = router({
  create: staffProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      startDate: z.string(), // ISO String
      endDate: z.string(), // ISO String
      location: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(events).values({
        name: input.title,
        description: input.description,
        startTime: new Date(input.startDate),
        endTime: new Date(input.endDate),
        location: input.location,
        churchId: ctx.session.churchId,
        createdBy: ctx.session.user.id,
      });
      return { success: true };
    }),

  update: staffProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      location: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       const event = await db.query.events.findFirst({
         where: (e, { eq, and }) => and(
           eq(e.id, input.id),
           eq(e.churchId, ctx.session.churchId!)
         )
       });

       if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

       if (event.createdBy !== ctx.session.user.id) {
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to update this event" });
       }

       const updates: any = {};
       if (input.title) updates.name = input.title;
       if (input.description) updates.description = input.description;
       if (input.startDate) updates.startTime = new Date(input.startDate);
       if (input.endDate) updates.endTime = new Date(input.endDate);
       if (input.location) updates.location = input.location;

       await db.update(events)
         .set(updates)
         .where(eq(events.id, input.id));

      return { success: true };
    }),

  delete: staffProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
       const event = await db.query.events.findFirst({
         where: (e, { eq, and }) => and(
           eq(e.id, input.id),
           eq(e.churchId, ctx.session.churchId!)
         )
       });

       if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

       if (event.createdBy !== ctx.session.user.id) {
         throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to delete this event" });
       }

       // Delete registrations first? Or cascade?
       // Usually better to explicit delete or rely on DB cascade. 
       // `eventRegistrations` has FK to `events`.
       // I'll try to delete registrations just in case, or assume cascade if configured (probably not configured in schema DSL usually unless "onDelete: cascade" is there).
       // `eventId: uuid('event_id').references(() => events.id)` <- No cascade specified in viewed file.
       
       await db.delete(eventRegistrations).where(eq(eventRegistrations.eventId, input.id));
       await db.delete(events).where(eq(events.id, input.id));

      return { success: true };
    }),


  list: staffProcedure
    .query(async ({ ctx }) => {
       const items = await db.query.events.findMany({
         where: (e, { eq }) => eq(e.churchId, ctx.session.churchId!),
         orderBy: [desc(events.startTime)],
       });
       return items;
    }),

  get: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
       const event = await db.query.events.findFirst({
         where: (e, { eq, and }) => and(
           eq(e.id, input.id),
           eq(e.churchId, ctx.session.churchId!)
         )
       });
       if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
       return event;
    }),

  listRegistrations: staffProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const registrations = await db.query.eventRegistrations.findMany({
        where: (reg, { eq }) => eq(reg.eventId, input.eventId),
        with: {
          user: true, // Fetch user details who registered
        }
      });
      return registrations;
    }),
});
