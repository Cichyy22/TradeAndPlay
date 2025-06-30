'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/app/components/MapView'), { ssr: false });

export default function HomePage() {
  const [distance, setDistance] = useState(5);

  return (
    <div className="h-full w-full relative">
      <MapView distanceKm={distance} />

      <div className="absolute bottom-12 right-4 bg-white p-3 rounded shadow-md flex items-center gap-2 z-[1000] text-black">
        <label htmlFor="radius">Zasięg (km):</label>
        <input
          id="radius"
          type="number"
          min={1}
          max={100}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
      </div>
    </div>
  );
}