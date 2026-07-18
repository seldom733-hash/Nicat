'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Mail, Phone, Globe, Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nicat</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('about')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('platform')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/explore`} className="hover:text-white transition-colors">
                  {t('explore')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/explore`} className="hover:text-white transition-colors">
                  {t('tours')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dashboard`} className="hover:text-white transition-colors">
                  {t('becomeHost')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@nicat.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Travel Street<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}