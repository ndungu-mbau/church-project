import type { BetterAuthClientPlugin } from "better-auth";

export const profileLinkerClient = () => {
  return {
    id: "profile-linker",
    $InferServerPlugin: {} as ReturnType<typeof import("./server").profileLinkerPlugin>,
  } satisfies BetterAuthClientPlugin;
};
