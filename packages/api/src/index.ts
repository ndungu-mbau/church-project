import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { db } from "@church-project/db";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	const existingUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, ctx?.session?.user?.id ?? ""),
	});
	
	if(!existingUser){
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	
	return next({
		ctx: {
			...ctx,
			session: {
				...ctx.session,
				user: existingUser,
			},
		},
	});
});

export const superuserProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "superadmin") {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Superadmin role required",
			cause: "No superadmin",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "admin") {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Admin role required",
			cause: "No admin",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const staffProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "staff") {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Staff role required",
			cause: "No staff",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const pastorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "pastor") {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Pastor role required",
			cause: "No pastor",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const memberProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "member") {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Member role required",
			cause: "No member",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const guestProcedure = protectedProcedure