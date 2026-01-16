import { expo } from '@better-auth/expo';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@church-project/db";
import * as schema from "@church-project/db/schema/auth";
import { otpPluginServer } from "./plugins/otp-plugin";
import crypto from "node:crypto"

import { profileLinkerPlugin } from "./plugins/profile-linker";
import { platformDetectorPlugin } from "./plugins/platform-detector";
import { webAuthPlugin } from "./plugins/web-auth";
import { mobileAuthPlugin } from "./plugins/mobile-auth";
import { adminRegistrationPlugin } from "./plugins/admin-registration";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",

    schema: schema,
  }),
  trustedOrigins: ["*"],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "guest",
        input: false, // Don't allow setting this during signup
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  plugins: [
    platformDetectorPlugin(),
    adminRegistrationPlugin(),
    profileLinkerPlugin(),
    mobileAuthPlugin(),
    webAuthPlugin(),
    otpPluginServer(),
    expo(),
  ],
});

