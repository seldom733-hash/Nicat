'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, MapPin, Loader2, Pencil, Trash2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { toursApi } from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import type { Tour } from '@/lib/api';
import { getCategoryLabel } from '@/lib/utils';

export default function MyToursPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const t = useTranslations('myTours');
  const locale = useLocale();
  const [myTours, setMyTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    try {
      const toursData = await toursApi.getMyTours(1, 100);
      setMyTours(Array.isArray(toursData?.tours) ? toursData.tours : Array.isArray(toursData) ? toursData : []);
    } catch (err) {
      console.error('Failed to load tours:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchTours();
  }, [isAuthenticated, authLoading, fetchTours]);

  const handleDelete = async (tourId: string) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeletingId(tourId);
    try {
      await toursApi.delete(tourId);
      setMyTours((prev) => prev.filter((tour) => tour.id !== tourId));
    } catch (err) {
      console.error('Failed to delete tour:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              {t('title')} ({myTours.length})
            </CardTitle>
            <Link href={`/${locale}/tours/create`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {t('createTour')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myTours.length === 0 ? (
              <div className="text-center py-12">
                <Compass className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">{t('noTours')}</p>
                <Link href={`/${locale}/tours/create`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('createFirst')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myTours.map((tour) => (
                  <div key={tour.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    {/* Tour image */}
                    <div className="relative h-44 bg-gradient-to-br from-blue-500 to-purple-500">
                      {tour.media && tour.media.length > 0 ? (
                        <img
                          src={getMediaUrl(tour.media[0].url)}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Compass className="h-12 w-12 text-white/40" />
                        </div>
                      )}
                      <Badge
                        className={`absolute top-3 left-3 ${
                          tour.status === 'active' ? 'bg-green-600' :
                          tour.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                      >
                        {tour.status}
                      </Badge>
                    </div>

                    {/* Tour info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{tour.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {tour.city}, {tour.country}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary-700">${tour.basePrice}</span>
                        <span className="text-xs text-gray-400">{getCategoryLabel(tour.category, locale)}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4">
                        <Link href={`/${locale}/tours/${tour.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            {t('edit')}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(tour.id)}
                          disabled={deletingId === tour.id}
                        >
                          {deletingId === tour.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
