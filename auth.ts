import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { landlordDb } from "./lib/db/landlord/client"
import { adminUsers } from "./lib/db/landlord/schema"
import { eq } from "drizzle-orm"

import type { MicrosoftEntraIDProfile } from "@auth/core/providers/microsoft-entra-id"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AUTH_AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AUTH_AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_AZURE_AD_TENANT_ID!}/v2.0/`,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "azure-ad" && profile) {
        // profile.oid is the Entra ID unique subject ID
        const azureProfile = profile as unknown as MicrosoftEntraIDProfile;
        const azureAdId = azureProfile.oid;
        const email = user.email!;
        const name = user.name || "Unknown User";

        if (!azureAdId) return false;

        // Upsert logic
        const existing = await landlordDb.select().from(adminUsers).where(eq(adminUsers.azureAdId, azureAdId)).limit(1);
        
        if (existing.length === 0) {
          // Check if email exists (edge case: user added manually before Entra login)
          const byEmail = await landlordDb.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
          if (byEmail.length > 0) {
            await landlordDb.update(adminUsers).set({ azureAdId, name }).where(eq(adminUsers.id, byEmail[0].id));
          } else {
            await landlordDb.insert(adminUsers).values({
              email,
              name,
              azureAdId,
              role: 'viewer', // default role
            });
          }
        } else {
          // Update name just in case it changed
          await landlordDb.update(adminUsers).set({ name }).where(eq(adminUsers.id, existing[0].id));
        }
        return true;
      }
      return false; // Deny logins that aren't azure-ad for now
    },
    async jwt({ token, user, profile, account }) {
      // First time login - attach DB id and role to token
      if (account && profile) {
        const azureProfile = profile as unknown as MicrosoftEntraIDProfile;
        const azureAdId = azureProfile.oid;
        const dbUser = await landlordDb.select().from(adminUsers).where(eq(adminUsers.azureAdId, azureAdId)).limit(1);
        if (dbUser.length > 0) {
          token.dbId = dbUser[0].id;
          token.role = dbUser[0].role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token claims to the session object for client-side/server-side use
      if (session.user) {
        session.user.dbId = token.dbId as string | undefined;
        session.user.role = token.role as string | undefined;
      }
      return session;
    }
  }
})
