import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma/client"

export function CustomPrismaAdapter(prisma: PrismaClient) {
  const base = PrismaAdapter(prisma)

  return {
    ...base,
    async getSessionAndUser(sessionToken: string) {
      const session = await prisma.session.findFirst({
        where: { sessionToken },
      })

      if (!session) return null

      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      })

      if (!user) return null

      return { session, user }
    },
  }
}