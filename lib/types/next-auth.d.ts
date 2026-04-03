import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      dbId?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    dbId?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    dbId?: string
    role?: string
  }
}
