
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { eventSchema } from '@/lib/schema';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const userId = session?.user?.id;
  const all = url.searchParams.get('all');
   if (all === 'true') {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ events });
  }

  const createdEvents = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, email: true } // tylko potrzebne pola
          }
        }
      }
    },
  });

  const participatingEvents = await prisma.event.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, email: true } // tylko potrzebne pola
          }
        }
      }
    },
  });

  return NextResponse.json({ createdEvents, participatingEvents });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rawData = await req.json();
 
  const result = eventSchema.safeParse(rawData);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
  }

  const validatedData = result.data;
  try {
    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date), 
        organizerId: session?.user?.id ?? "",
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
