import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const eventId = id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { participants: true },
  });

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  if (event.organizerId === userId) {
    const data = await req.json();
    try {
      const updated = await prisma.event.update({
        where: { id: eventId },
        data,
      });
      return NextResponse.json(updated);
    } catch (error) {
      return NextResponse.json({ error: 'Update failed', details: error }, { status: 500 });
    }
  }

  
  const isParticipant = event.participants.some(p => p.userId === userId);

  if (isParticipant) {
  await prisma.eventParticipant.delete({
    where: {
      userId_eventId: { userId, eventId },
    },
  });
  return NextResponse.json({ message: 'Left event' });
} else {
  if (event.participants.length >= event.capacity) {
    return NextResponse.json(
      { error: 'Event capacity reached' },
      { status: 400 }
    );
  }

  
  await prisma.eventParticipant.create({
    data: {
      userId,
      eventId,
    },
  });
  return NextResponse.json({ message: 'Joined event' });
}
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;
  const eventId = params.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  if (event.organizerId !== userId) {
    return NextResponse.json({ error: 'Forbidden – Only the organizer can delete' }, { status: 403 });
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return NextResponse.json({ message: 'Event deleted' });
}