import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';

export default function InfoPage() {
  const t = useTranslations('info');

  return (
    <>
     <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-6 text-gray-800">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p>{t('intro')}</p>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t('howWorks.title')}</h2>
          <p>{t('howWorks.desc1')}</p>
          <p>{t('howWorks.desc2')}</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t('features.title')}</h2>
          <ul className="list-disc list-inside">
            <li>{t('features.point1')}</li>
            <li>{t('features.point2')}</li>
            <li>{t('features.point3')}</li>
          </ul>
        </section>
      </main>
    </>
  );
}