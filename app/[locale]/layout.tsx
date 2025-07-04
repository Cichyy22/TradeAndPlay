import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from "@/app/components/Navbar";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <div className="h-12 shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
