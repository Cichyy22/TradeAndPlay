'use client';

import { useState } from 'react';
import {useTranslations} from 'next-intl';
// import { z } from 'zod';
import { listingSchema } from '@/lib/schema';

import { toast } from 'react-toastify';

export default function AddListingForm({
  lat,
  lng,
  onSubmit,
}: {
  lat?: number;
  lng?: number;
  onSubmit: (data: unknown) => void;
}) {
  const t = useTranslations();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState<'BOOK' | 'GAME'>('BOOK');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const dataToValidate = {
    title,
    description: description || undefined,
    contact: contact || undefined,
    type,
    location: lat && lng ? { lat, lng } : undefined,
  };

  const result = listingSchema.safeParse(dataToValidate);

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
    const res = await fetch('/api/listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToValidate),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(`${t('listing.error')}: ` + data.error, {
      position: 'bottom-left',
    });
      return;
    }
    toast.success(`${t('toast.success')}`, {
      position: 'bottom-left',
    });
    onSubmit(data);
  } catch (error) {
      toast.error(`${t('listing.error')}: ` + (error as Error).message, {
      position: 'bottom-left',
    });
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto p-4 text-sm space-y-3 m-4">

   <form
  onSubmit={handleSubmit}
  
>
  <h3 className="text-2xl font-semibold text-gray-800 text-center">{t('listing.add')}</h3>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">{t('listing.title')}:</label>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
      placeholder= {t('listing.place-title')}
    />
    {errors.title && <p className="text-red-600 text-sm mt-1">{t(`${errors.title}`)}</p>}
  </div>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">{t('listing.desc')}:</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
      placeholder={t('listing.place-desc')}
    />
    {errors.description && <p className="text-red-600 text-sm mt-1">{t(`${errors.description}`)}</p>}
  </div>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">{t('listing.type')}:</label>
    <select
      value={type}
      onChange={(e) => setType(e.target.value as 'BOOK' | 'GAME')}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
    >
      <option value="BOOK">{t('listing.book')}</option>
      <option value="GAME">{t('listing.game')}</option>
    </select>
  </div>
   <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">{t('listing.contact')}:</label>
    <input
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      required
      className={`px-3 mb-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
      placeholder={t('listing.place-contact')}
    />
    {errors.contact && <p className="text-red-600 text-sm mt-1">{t(`${errors.contact}`)}</p>}
  </div>

   <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        {loading ? `${t('listing.in-progress')}` : `${t('listing.add')}`}
      </button>
</form>
</div>
  );
}
