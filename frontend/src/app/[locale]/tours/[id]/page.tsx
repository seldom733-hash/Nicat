'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Star, Calendar, Users, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { toursApi } from '@/lib/api';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import type { Tour } from '@/lib/api';
import Link from 'next/link';
import TourGallery from '@/components/tours/TourGallery';

const TourChatWidget = dynamic(() => import('@/components/chat/TourChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('tours.detail');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await toursApi.getById(params.id as string);
        setTour(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchTour();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{tCommon('error')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/explore`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {tCommon('back')}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
              <Badge>{getCategoryLabel(tour.category, locale)}</Badge>
            </div>
          </div>

          {/* Gallery — centered, not bound by container */}
          <TourGallery media={tour.media} title={tour.title} />

          <div className="p-8 pt-0">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  {tour.city}, {tour.country}
                </div>

                <p className="text-gray-600 mb-6">{tour.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{tour.startDate} - {tour.endDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{t('maxParticipants')}: {tour.maxGroupSize}</span>
                  </div>
                </div>

                {tour.included && tour.included.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{t('included')}</h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tour.notIncluded && tour.notIncluded.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{t('notIncluded')}</h3>
                    <ul className="space-y-2">
                      {tour.notIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:w-80">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(tour.basePrice)}
                      </div>
                      <p className="text-gray-500">{t('pricePerPerson')}</p>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{tour.averageRating || 'New'}</span>
                    </div>

                    <Link href={`/${locale}/booking/${tour.id}`}>
                      <Button className="w-full" size="lg">
                        {t('bookNow')}
                      </Button>
                    </Link>

                    <div className="mt-3">
                      <TourChatWidget tour={tour} variant="button" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
