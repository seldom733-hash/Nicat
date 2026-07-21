'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/request';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    startTransition(() => {
      let newPathname = pathname;
      const localePrefix = `/${currentLocale}`;
      if (pathname.startsWith(localePrefix + '/') || pathname === localePrefix) {
        newPathname = pathname.slice(localePrefix.length) || '/';
      }
      const localizedPath = `/${newLocale}${newPathname === '/' ? '' : newPathname}`;
      router.push(localizedPath);
    });
  };

  const localeLabels: Record<Locale, string> = {
    en: 'EN',
    ru: 'RU',
    az: 'AZ',
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          disabled={isPending}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
            currentLocale === locale
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          } ${isPending ? 'opacity-50' : ''}`}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
