import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { auth } from "@/auth";
import { listingSchema } from '@/lib/schema'; 

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
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

     if (session?.user?.acceptedTerms == false) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = listingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }

    const { title, description, contact, type, location } = parsed.data;

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        contact,
        type,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('Błąd tworzenia ogłoszenia:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
