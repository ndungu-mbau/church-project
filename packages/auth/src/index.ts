import { expo } from '@better-auth/expo';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@church-project/db";
import * as schema from "@church-project/db/schema/auth";
// import { otpPluginServer } from "./plugins/otp-plugin";
import crypto from "node:crypto"

import { profileLinkerPlugin } from "./plugins/profile-linker";

export * from "./plugins/otp-plugin";
export * from "./plugins/profile-linker";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: ["*"],
	emailAndPassword: {
		enabled: true,
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
		}
	},
  plugins: [profileLinkerPlugin(), expo() ]
});

