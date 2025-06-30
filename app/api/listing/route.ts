import { NextResponse } from 'next/server';
import { PrismaClient, ListingType } from '@/app/generated/prisma';
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (userId !== session.user.id) {
        return NextResponse.json({ error: 'Brak dostępu do danych innego użytkownika' }, { status: 403 });
      }

      const listings = await prisma.listing.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(listings);
    }

    // Bez userId - zwracamy wszystkie listingi
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(listings);

  } catch (error) {
    console.error('Błąd pobierania:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    const { title, description, contact, type, location } = body;

    const userId = session?.user?.id;

    if (!userId || !title || !type) {
      return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        contact,
        type: type as ListingType,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
        userId,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('Błąd tworzenia ogłoszenia:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}