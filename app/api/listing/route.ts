import { NextResponse } from 'next/server';
import { PrismaClient, ListingType } from '@/app/generated/prisma'
import { auth } from "@/auth"

const prisma = new PrismaClient();

export async function GET() {
  try {
    const listings = await prisma.listing.findMany();
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Błąd pobierania:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth()
    const { title, description, type, location } = body;

    const userId = session?.user?.id;

    if (!userId || !title || !type) {
      return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
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