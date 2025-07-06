import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { getTranslations } from 'next-intl/server';

export default async function NotFoundPage() {
  const t = await getTranslations('not-found');

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">{t('title')}</p>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t('back-button')}
        </Link>
      </div>
    </>
  );
}