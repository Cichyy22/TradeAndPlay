import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { CustomPrismaAdapter } from "@/lib/customAdapter"
import { prisma } from "@/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async session({ session, user }) {
      session.user = user
      return session
    },
  },
})