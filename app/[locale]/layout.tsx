import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from "@/app/components/Navbar";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
             <div className="h-screen w-screen flex flex-col overflow-hidden">
<div className="h-12 shrink-0">
         <Navbar />
       </div>

       <div className="flex-1 overflow-hidden">
         {children}
      </div>
     </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}