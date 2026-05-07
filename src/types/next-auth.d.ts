import { DefaultSession, DefaultUser } from "next-auth"
import { UserStatus } from "@/generated/prisma/enums"
import { UserRole } from "@/generated/prisma/enums"

declare module "next-auth" {
  interface User extends DefaultUser {
    status?: UserStatus
    role?: UserRole
  }
  
  interface Session {
    user: {
      id: string
      status?: UserStatus
      role?: UserRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    status?: UserStatus
    role?: UserRole
  }
}