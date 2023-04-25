// based in: https://github.com/shadcn/taxonomy/blob/main/lib/auth.ts
//
// https://next-auth.js.org/configuration/initialization#route-handlers-app
// https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts
import { DefaultSession, NextAuthOptions, Session } from "next-auth"
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
// https://next-auth.js.org/providers/keycloak
import KeycloakProvider from "next-auth/providers/keycloak";

export interface AppJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
}

export interface AppSession extends DefaultSession {
  accessToken?: string;
  refreshToken?: string;
}

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
  callbacks: {
    async jwt({ token, account, profile }): Promise<AppJWT> {
      return {
        ...token,
        accessToken: `${account?.access_token ?? token?.accessToken}`,
        refreshToken: `${account?.refresh_token ?? token?.refreshToken}`,
      };
    },
    async session({ session, token, user }: {
      session: Session,
      token: AppJWT,
      user: AdapterUser,
    }): Promise<AppSession> {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
  },
}
