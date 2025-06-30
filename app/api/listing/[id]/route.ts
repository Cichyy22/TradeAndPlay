import { NextResponse } from 'next/server';
import { PrismaClient, ListingType } from '@/app/generated/prisma';
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listingId = params.id;
    const body = await request.json();
    const { title, description, type, contact, location } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 });
    }

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
        type: type as ListingType,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listingId = params.id;

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