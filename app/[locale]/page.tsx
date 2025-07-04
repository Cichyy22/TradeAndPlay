'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import TermsModal from '@/app/components/TermsModal';

const MapView = dynamic(() => import('@/app/components/MapView'), { ssr: false });

export default function HomePage() {
  const t = useTranslations();
  const [distance, setDistance] = useState(5);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [checkingTerms, setCheckingTerms] = useState(true);

  const refreshMap = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    async function checkAcceptedTerms() {
      try {
        const declined = localStorage.getItem('termsDeclined');
        if (declined === 'true') {
          setShowTermsModal(false);
          return setCheckingTerms(false);
        }
        const res = await fetch('/api/user/accepted-terms');
        const data = await res.json();
        if (!data.acceptedTerms) setShowTermsModal(true);
      } catch (e) {
        console.log(e);
        setShowTermsModal(true);
      } finally {
        setCheckingTerms(false);
      }
    }
    checkAcceptedTerms();
  }, []);

  const acceptTerms = async () => {
    try {
      const res = await fetch('/api/user/accepted-terms', { method: 'POST' });
      if (res.ok) {
        setShowTermsModal(false);
        localStorage.removeItem('termsDeclined');
      } else {
        alert(`${t('listing.error')}`);
      }
    } catch {
      alert(`${t('listing.error')}`);
    }
  };

  const declineTerms = () => {
    localStorage.setItem('termsDeclined', 'true');
    setShowTermsModal(false);
  };

  if (checkingTerms) return <div>{t('listing.load')}</div>;

  return (
    <main className="h-full w-full relative" role="main">
      <MapView key={refreshKey} distanceKm={distance} />

      <section
        aria-label={t('home.range')}
        className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md flex items-center gap-2 z-[1000] text-black"
      >
        <label htmlFor="radius">{t('home.range')} (km):</label>
        <input
          id="radius"
          type="number"
          min={1}
          max={100}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
          disabled={showTermsModal}
        />

        <button
          onClick={refreshMap}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          title={t('home.refresh')}
          type="button"
          disabled={showTermsModal}
        >
          {t('home.refresh')}
        </button>
      </section>

      {showTermsModal && (
        <TermsModal onAccept={acceptTerms} onDecline={declineTerms} />
      )}
    </main>
  );
}