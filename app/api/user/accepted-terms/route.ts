import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ acceptedTerms: false });
if(session.user?.email){
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
        select: { acceptedTerms: true },
    });

    return NextResponse.json({ acceptedTerms: user?.acceptedTerms ?? false });
}
  
}

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
if(session.user?.email){
  await prisma.user.update({
    where: { email: session.user.email },
    data: { acceptedTerms: true },
  });
}
  return NextResponse.json({ acceptedTerms: true });
}