'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import TermsModal from '@/app/components/TermsModal';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
}

export default function UserProfileCard({ user }: { user: User }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations();
  useEffect(() => {
    const checkAccepted = async () => {
      try {
        const res = await fetch('/api/user/accepted-terms');
        const data = await res.json();
        setAccepted(data.acceptedTerms);
      } catch {
        setAccepted(false); 
      }
    };
    checkAccepted();
  }, []);

  const acceptTerms = async () => {
    try {
      const res = await fetch('/api/user/accepted-terms', {
        method: 'POST',
      });
      if (res.ok) {
        setAccepted(true);
        setShowModal(false);
      } else {
        alert(`${t('listing.error')}`);
      }
    } catch {
      alert(`${t('listing.error')}`);
    }
  };

  const declineTerms = () => {
    setShowModal(false); 
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto text-black">
      <div className="flex items-center gap-4">
        <Image
          src={user.image}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      
      {accepted === false && (
        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {t('terms.title')}
        </button>
      )}

      
      {showModal && (
        <TermsModal onAccept={acceptTerms} onDecline={declineTerms} />
      )}
    </div>
  );
}
