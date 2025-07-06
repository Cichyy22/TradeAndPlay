/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { listingSchema } from '@/lib/schema';
import { prisma } from '@/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if ((session?.user as any).acceptedTerms == false) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listingId = (await params).id;
    const body = await req.json();

    const parsed = listingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }

    const { title, description, contact, type } = parsed.data;

    const existing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title,
        description,
        contact,
        type
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if ((session?.user as any).acceptedTerms == false) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listingId = (await params).id;

    const existing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: listingId } });

    return NextResponse.json({ message: 'Usunięto ogłoszenie' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}