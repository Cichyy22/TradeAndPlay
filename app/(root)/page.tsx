'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/app/components/MapView'), { ssr: false });

export default function HomePage() {
  const [distance, setDistance] = useState(5);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshMap = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="h-full w-full relative">
      <MapView key={refreshKey} distanceKm={distance} />

      <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md flex items-center gap-2 z-[1000] text-black">
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


        <button
          onClick={refreshMap}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          title="Odśwież mapę"
          type="button"
        >
          Odśwież
        </button>
      </div>
    </div>
  );
}