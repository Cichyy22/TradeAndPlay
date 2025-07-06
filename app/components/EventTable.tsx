'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import EventForm from './EventForm';

interface User {
  id: string;
  email: string;
}

interface Participant {
  id: string;
  userId: string;
  user: User; // dodajemy user z email
  joinedAt: string;
}

interface EventType {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  isPrivate?: boolean;
  capacity?: number;
  organizerId: string;
  participants?: Participant[]; // teraz z user.email
}

interface EventsTableProps {
  userId: string;
}

export default function EventsTable({ userId }: EventsTableProps) {
  const [events, setEvents] = useState<{
    createdEvents: EventType[];
    participatingEvents: EventType[];
  }>({ createdEvents: [], participatingEvents: [] });
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const t = useTranslations();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/event?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error(`${t('event.error-downloading')}: ` + error, {
        position: 'bottom-left',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async (id: string) => {
    if (!confirm(`${t('event.leave-confirm')}`)) return;
    try {
      const res = await fetch(`/api/event/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave' }),
      });
      if (!res.ok) throw new Error();
      toast.success(t('toast.success'), { position: 'bottom-left' });
      fetchEvents();
    } catch (error) {
      toast.error(t('event.leave-error')+ error, { position: 'bottom-left' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`${t('event.delete-confirm')}`)) return;
    try {
      const res = await fetch(`/api/event/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success(t('toast.success'), { position: 'bottom-left' });
      fetchEvents();
    } catch (error) {
      toast.error(t('event.delete-error')+ error, { position: 'bottom-left' });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const renderParticipantsEmails = (participants?: Participant[]) => {
    if (!participants || participants.length === 0) return '-';
    return participants.map((p) => p.user.email).join(', ');
  };

  return (
    <div className="space-y-8">
      {events.createdEvents.length > 0 && (
        <>
          <h3 className="text-lg font-medium">{t('event.your')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('event.name')}</TableHead>
                <TableHead>{t('event.date')}</TableHead>
                <TableHead>{t('event.location')}</TableHead>
                <TableHead>{t('event.participants')}</TableHead>
                <TableHead className="text-right">{t('event.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.createdEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{renderParticipantsEmails(event.participants)}</TableCell> 
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingEvent(event)}
                    >
                      {t('event.edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(event.id)}
                    >
                      {t('event.delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {events.participatingEvents.length > 0 && (
        <>
          <h3 className="text-lg font-medium">{t('event.joined')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('event.name')}</TableHead>
                <TableHead>{t('event.date')}</TableHead>
                <TableHead>{t('event.location')}</TableHead>
                <TableHead>{t('event.participants')}</TableHead> 
                <TableHead className="text-right">{t('event.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.participatingEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{renderParticipantsEmails(event.participants)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleLeave(event.id)}
                    >
                      {t('event.leave')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {editingEvent && (
       <EventForm
          isEdit
          initialData={{
            ...editingEvent,
            capacity: editingEvent.capacity ?? 0,  // domyślnie 0, albo inna wartość
          }}
          onClose={() => setEditingEvent(null)}
          onSubmit={() => {
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}

      {!loading &&
        events.createdEvents.length === 0 &&
        events.participatingEvents.length === 0 && (
          <p className="text-center text-muted-foreground">{t('event.empty')}</p>
        )}
    </div>
  );
}
