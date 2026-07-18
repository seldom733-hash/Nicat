'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingConfirmationPage() {
  const t = useTranslations('booking.confirmation');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-gray-600 mb-8">{t('subtitle')}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-4">{t('tourDetails')}</h2>
              <p className="text-sm text-gray-500">
                {t('bookingId')}: #12345
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/dashboard`}>
                <Button>{t('viewDashboard')}</Button>
              </Link>
              <Link href={`/${locale}`}>
                <Button variant="outline">{t('backToHome')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
