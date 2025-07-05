'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { eventSchema } from '@/lib/schema';
import type { z } from 'zod';

interface EventFormProps {
  onSubmit: () => void;
  onClose: () => void;
  initialData?: z.infer<typeof eventSchema> & { id: string };
  isEdit?: boolean;
  lat?: number;
  lng?: number;
}

export default function EventForm({
  onSubmit,
  onClose,
  initialData,
  isEdit,
  lat,
  lng,
}: EventFormProps) {
  const t = useTranslations('event');

  const [name, setName] = useState(initialData?.name || '');
 
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [capacity, setCapacity] = useState<number>(initialData?.capacity || 0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

 const [date, setDate] = useState(
  initialData?.date ? formatDateForInput(initialData.date) : ''
);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const baseData = {
      name,
      date,
      location,
      description,
      capacity,
    };

   
    const dataToValidate = !isEdit && lat && lng
      ? { ...baseData, lat, lng }
        : { ...baseData, date: new Date(date).toISOString() };

    const result = eventSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(({ path, message }) => {
        if (path.length > 0) fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const res = await fetch(
        isEdit ? `/api/event/${initialData?.id}` : '/api/event',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToValidate),
        }
      );

      if (!res.ok) throw new Error();
      onSubmit();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-lg w-full p-6">
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold">{isEdit ? t('edit-event') : t('add-event')}</h2>

      <div className="flex flex-col">
        <label>{t('name')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{t(errors.name)}</p>}
      </div>

      <div className="flex flex-col">
        <label>{t('date')}</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`border p-2 rounded ${errors.date ? 'border-red-500' : ''}`}
        />
        {errors.date && <p className="text-red-500 text-sm">{t(errors.date)}</p>}
      </div>

      <div className="flex flex-col">
        <label>{t('location')}</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`border p-2 rounded ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location && <p className="text-red-500 text-sm">{t(errors.location)}</p>}
      </div>

      <div className="flex flex-col">
        <label>{t('capacity')}</label>
        <input
          value={capacity}
          type="number"
          onChange={(e) => setCapacity(Number(e.target.value))}
          className={`border p-2 rounded ${errors.capacity ? 'border-red-500' : ''}`}
        />
        {errors.capcity && <p className="text-red-500 text-sm">{t(errors.capcity)}</p>}
      </div>

      <div className="flex flex-col">
        <label>{t('description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? t('in-progress') : isEdit ? t('edit') : t('add')}
      </button>
       <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {t('cancel')}
            </button>
    </form>
    </div>
    </div>
  );
}