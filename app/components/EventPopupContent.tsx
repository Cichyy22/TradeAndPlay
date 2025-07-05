'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface EventPopupContentProps {
  event: {
    id: string;
    name: string;
    description?: string;
    location: string;
    date: string;
    organizerId: string;
    participants: { id: string }[];
  };
  onStatusChange?: () => void; 
}

export default function EventPopupContent({ event, onStatusChange }: EventPopupContentProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const t = useTranslations('event');
  const [loading, setLoading] = useState(false);
  const [isParticipant, setIsParticipant] = useState( Array.isArray(event.participants) && event.participants.some(p => p.id === userId));
  
  const isOrganizer = userId === event.organizerId;

   useEffect(() => {
    setIsParticipant(Array.isArray(event.participants) && event.participants.some(p => p.id === userId));
  }, [event.participants, userId]);


  const handleToggleParticipation = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/event/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    toast.success(data.message || t('status-changed'), { position: 'bottom-left' });
    setIsParticipant(prev => !prev);
    onStatusChange?.();
  } catch {
    toast.error(t('action-error'), { position: 'bottom-left' });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="text-sm space-y-2 max-w-xs">
      <h3 className="text-lg font-semibold">{event.name}</h3>
      <p className="text-gray-700">{event.description}</p>
      {userId && (<>
        <p><strong>{t('location')}:</strong> {event.location}</p>
      <p><strong>{t('date')}:</strong> {new Date(event.date).toLocaleString()}</p>

      {!isOrganizer && (
        <button
          onClick={handleToggleParticipation}
          disabled={loading}
          className={`w-full py-1 px-2 rounded text-white ${
            isParticipant ? 'bg-red-600 hover:bg-red-700 ' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading
            ? t('loading')
            : isParticipant
              ? t('leave')
              : t('join')}
        </button>
      )}
      </>)}
    </div>
  );
}
