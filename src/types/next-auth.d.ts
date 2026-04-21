import { DefaultSession, DefaultUser } from "next-auth"
import { UserStatus } from "@prisma/client"  // Import your enum

declare module "next-auth" {
  interface User extends DefaultUser {
    status?: UserStatus  // Add your custom status field
  }
  
  interface Session {
    user: {
      id: string
      status?: UserStatus
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    status?: UserStatus
  }
}