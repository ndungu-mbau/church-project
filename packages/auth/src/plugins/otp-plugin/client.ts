import type { BetterAuthClientPlugin } from "better-auth";
import type { BetterFetchOption } from "better-auth/client";

export const otpPluginClient = () => {
  return {
    id: "otp-plugin",
    $InferServerPlugin: {} as ReturnType<typeof import("./server").otpPluginServer>,
    getActions: ($fetch) => {
            return {
                sendOtp: async (data: { phone: string }, fetchOptions?: BetterFetchOption) => {
                    return await $fetch("/otp/send", {
                        method: "POST",
                        body: data,
                        ...fetchOptions,
                    });
                },
                verifyOtp: async (data: { phone: string; code: string }, fetchOptions?: BetterFetchOption) => {
                    return await $fetch("/otp/verify", {
                        method: "POST",
                        body: data,
                        ...fetchOptions,
                    });
                },
            };
        },
  } satisfies BetterAuthClientPlugin;
};
