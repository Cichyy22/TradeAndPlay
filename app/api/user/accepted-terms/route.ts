import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from '@/prisma';

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