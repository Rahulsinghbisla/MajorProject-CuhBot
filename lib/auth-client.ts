import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [polarClient()],
});


// export async function getTokenOnClient(): Promise<string | null> {
//   try {
//     const { data } = await authClient.token();
//     const token = data?.token ?? null;
//     return token;
//   } catch {
//     return null;
//   }
// }
