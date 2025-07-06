'use client';

import { useTranslations } from 'next-intl';

export default function InstructionModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('instructions');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1002] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
          aria-label={t('close')}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>

        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
          <li>{t('step4')}</li>
        </ul>
      </div>
    </div>
  );
}
