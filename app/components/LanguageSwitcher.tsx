'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locales = ['pl', 'en'];
  const currentLocale = pathname.split('/')[1] || 'pl';

  const changeLocale = (locale: string) => {
    if (locale === currentLocale) return;
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/') + (searchParams ? `?${searchParams.toString()}` : '');
    router.push(newPath);
  };

  return (
    <div className="text-sm select-none">
      {locales.map((locale, index) => (
        <span key={locale}>
          <button
            onClick={() => changeLocale(locale)}
            disabled={locale === currentLocale}
            className={locale === currentLocale ? 'font-bold cursor-default' : 'cursor-pointer hover:underline'}
            type="button"
          >
            {locale}
          </button>
          {index < locales.length - 1 && <span className="mx-1">|</span>}
        </span>
      ))}
    </div>
  );
}
