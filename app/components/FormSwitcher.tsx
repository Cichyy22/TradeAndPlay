'use client';

import { useState } from 'react';
import AddListingForm from './AddListingForm'; 
import EventForm from './EventForm';
import { useTranslations } from 'next-intl';

interface ListingData {
  id: string;
  title: string;
  description: string;
  contact: string;
  type: 'BOOK' | 'GAME';
  lat?: number;
  lng?: number;
}

export default function FormSwitcher({
  lat,
  lng,
  onAddListing,
  onAddEvent,
}: {
  lat?: number;
  lng?: number;
  onAddListing: (data: ListingData) => void;
  onAddEvent: () => void;
}) {
  const [activeForm, setActiveForm] = useState<'listing' | 'event' | null>(null);
  const t = useTranslations();

  const closeEventForm = () => setActiveForm(null);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveForm('listing')}
          className={`px-4 py-2 rounded ${
            activeForm === 'listing' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {t('listing.add')}
        </button>
        <button
          onClick={() => setActiveForm('event')}
          className={`px-4 py-2 rounded ${
            activeForm === 'event' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {t('event.add-event')}
        </button>
      </div>

      {activeForm === 'listing' && (
        <AddListingForm lat={lat} lng={lng} onSubmit={onAddListing} />
      )}

      {activeForm === 'event' && (
        <EventForm
          lat={lat} lng={lng} 
          onSubmit={() => {
            onAddEvent();
            closeEventForm();
          }}
          onClose={closeEventForm}
          isEdit={false}
        />
      )}
    </div>
  );
}
