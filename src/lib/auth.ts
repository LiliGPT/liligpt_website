// based in: https://github.com/shadcn/taxonomy/blob/main/lib/auth.ts
//
// https://next-auth.js.org/configuration/initialization#route-handlers-app
// https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts
import { NextAuthOptions } from "next-auth"
// https://next-auth.js.org/providers/keycloak
import KeycloakProvider from "next-auth/providers/keycloak";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  session: {
    strategy: "jwt",
  },
  // do i need callbacks?
  // callbacks: {
  //   async jwt({ token }) {
  //     token.userRole = "admin"
  //     return token
  //   },
  // },
}
