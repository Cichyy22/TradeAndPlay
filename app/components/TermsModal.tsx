'use client';

import { useTranslations } from 'next-intl';

interface TermsModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({ onAccept, onDecline }: TermsModalProps) {
  const t = useTranslations('terms');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white max-w-3xl w-full rounded-lg p-6 shadow-lg overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4 text-center">{t('title')}</h2>
        <div className="mb-6 text-gray-800 leading-relaxed">
          <p>{t('paragraph1')}</p>
          <p className="mt-4">{t('paragraph2')}</p>
          <p className="mt-4">{t('paragraph3')}</p>
          <p className="mt-4">{t('paragraph4')}</p>
          <p className="mt-4">{t('paragraph5')}</p>
          <p className="mt-4">{t('paragraph6')}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDecline}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            {t('decline')}
          </button>
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
