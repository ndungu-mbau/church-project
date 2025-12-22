import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, APIError } from "better-auth/api";
import { z } from "zod";
import { otpStorage, sendSms } from "@church-project/utils";
import { db } from "@church-project/db";
import { profiles } from "@church-project/db/schema/profiles";
import { members } from "@church-project/db/schema/members";
import { staff } from "@church-project/db/schema/staff";
import { eq } from "drizzle-orm";

export const otpPluginServer = () => {
  return {
    id: "otp-plugin",
    endpoints: {
      sendOtp: createAuthEndpoint(
        "/otp/send",
        {
          method: "POST",
          body: z
            .object({
              phone: z.string(),
            })
            .refine((data) => data.phone, {
              message: "Phone number is required",
            }),
        },
        async (ctx) => {
          const { phone } = ctx.body;

          console.log({ phone });

          if (!phone) {
            throw new APIError("BAD_REQUEST", { message: "phone required" });
          }

          // Enforce: phone OTP only for existing staff or member records
          const profileForPhone = await db.query.profiles.findFirst({
            where: eq(profiles.phone, phone),
          });
          if (!profileForPhone) {
            throw new APIError("FORBIDDEN", {
              message: "Phone not eligible for OTP login",
            });
          }
          const hasMember = await db.query.members.findFirst({
            where: eq(members.profileId, profileForPhone.id),
          });
          const hasStaff = await db.query.staff.findFirst({
            where: eq(staff.profileId, profileForPhone.id),
          });
          if (!hasMember && !hasStaff) {
            throw new APIError("FORBIDDEN", {
              message: "Phone login allowed only for staff or members",
            });
          }

          // Rate limiting
          const attempts = await otpStorage.getAttempts(phone);
          if (attempts > 5) {
            throw new APIError("TOO_MANY_REQUESTS", {
              message: "Too many OTP requests. Please try again later.",
            });
          }

          // Generate 6-digit OTP
          const code =
            process.env.NODE_ENV === "production"
              ? Math.floor(100000 + Math.random() * 900000).toString()
              : "000000";

          // Store in Redis (expires in 5 minutes)
          await otpStorage.set(phone, code, 5);

          let success = false;

          if (phone) {
            // Send SMS
            const result = await sendSms({
              phone,
              text: `Your verification code is ${code}`,
            });
            success = result.success;
          }

          if (!success) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to send OTP",
            });
          }

          return ctx.json({
            success: true,
            // Return OTP in dev only
            ...(process.env.NODE_ENV !== "production" && { code }),
          });
        }
      ),
      verifyOtp: createAuthEndpoint(
        "/otp/verify",
        {
          method: "POST",
          body: z
            .object({
              phone: z.string(),
              code: z.string(),
            })
            .refine((data) => data.phone, {
              message: "Phone number is required",
            }),
        },
        async (ctx) => {
          const { phone, code } = ctx.body;

          if (!phone) {
            throw new APIError("BAD_REQUEST", { message: "phone required" });
          }

          // Verify OTP
          const storedOtp = await otpStorage.get(phone);

          if (!storedOtp || storedOtp !== code) {
            // Increment attempts
            await otpStorage.incrementAttempts(phone);
            throw new APIError("BAD_REQUEST", {
              message: "Invalid or expired OTP",
            });
          }

          // Clear OTP and attempts
          await otpStorage.delete(phone);
          await otpStorage.resetAttempts(phone);

          // Find user by phone
          const existingProfile = await db.query.profiles.findFirst({
            where: eq(profiles.phone, phone),
            with: {
              user: true,
            },
          });

          console.log({ existingProfile });

          if (!existingProfile) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "No profile with phone found",
            });
          }

          if (!existingProfile.user?.id) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "No user with phone found",
            });
          }
          // Enforce: phone OTP only for existing staff or member records
          const memberForProfile = await db.query.members.findFirst({
            where: eq(members.profileId, existingProfile.id),
          });
          const staffForProfile = await db.query.staff.findFirst({
            where: eq(staff.profileId, existingProfile.id),
          });
          if (!memberForProfile && !staffForProfile) {
            throw new APIError("FORBIDDEN", {
              message: "Phone login allowed only for staff or members",
            });
          }
          // Update verified status if not already
          if (phone && !existingProfile.phoneVerified) {
            await ctx.context.internalAdapter.updateUser(existingProfile.id, {
              phoneVerified: true,
            });
          }

          // Create session
          const session = await ctx.context.internalAdapter.createSession(
            existingProfile.user.id
          );

          if (!session) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to create session",
            });
          }

          // Return session, client should handle it or we rely on better-auth defaults
          // await ctx.context.setSessionCookie(session);

          await ctx.context.setNewSession({
            session,
            user: existingProfile.user,
          });
          return ctx.context.session;
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
