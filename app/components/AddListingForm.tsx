'use client';

import { useState } from 'react';

export default function AddListingForm({
  lat,
  lng,
  onSubmit,
}: {
  lat?: number;
  lng?: number;
  onSubmit: (data: unknown) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState<'BOOK' | 'GAME'>('BOOK');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        type,
        contact,
        location: lat && lng ? { lat, lng } : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert('Błąd: ' + data.error);
      return;
    }

    onSubmit(data);
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4"
>
  <h3 className="text-2xl font-semibold text-gray-800 text-center">Dodaj ogłoszenie</h3>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">Tytuł:</label>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Wpisz tytuł ogłoszenia"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">Opis:</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
      placeholder="Opisz swoje ogłoszenie"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">Typ:</label>
    <select
      value={type}
      onChange={(e) => setType(e.target.value as 'BOOK' | 'GAME')}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="BOOK">Książka</option>
      <option value="GAME">Gra</option>
    </select>
  </div>
   <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700">Kontakt:</label>
    <input
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      required
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Podaj kontakt dla zainteresowanych (nr. telefonu, discord itp.)"
    />
  </div>

   <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
      </button>
</form>

  );
}
