'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Search,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Globe,
  Shield,
  CreditCard,
  MessageCircle,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toursApi } from '@/lib/api';
import { formatPrice, getCategoryLabel, getMediaUrl } from '@/lib/utils';
import { getLocalizedTour } from '@/lib/utils/translate-tour';
import type { Tour } from '@/lib/api';

const TourChatWidget = dynamic(() => import('@/components/chat/TourChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const tours = await toursApi.getFeatured(6);
        setFeaturedTours(Array.isArray(tours) ? tours : []);
      } catch {
        // Use demo data
        setFeaturedTours([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const features = [
    {
      icon: Globe,
      title: t('features.globalTours.title'),
      description: t('features.globalTours.description'),
    },
    {
      icon: Users,
      title: t('features.groupTravel.title'),
      description: t('features.groupTravel.description'),
    },
    {
      icon: Shield,
      title: t('features.securePayments.title'),
      description: t('features.securePayments.description'),
    },
    {
      icon: MessageCircle,
      title: t('features.realtimeChat.title'),
      description: t('features.realtimeChat.description'),
    },
  ];

  const categories = [
    { slug: 'adventure', name: t('categories.adventure'), icon: '🏔️', color: 'from-orange-500 to-red-500' },
    { slug: 'cultural', name: t('categories.cultural'), icon: '🏛️', color: 'from-blue-500 to-indigo-500' },
    { slug: 'nature', name: t('categories.nature'), icon: '🌿', color: 'from-green-500 to-emerald-500' },
    { slug: 'beach', name: t('categories.beach'), icon: '🏖️', color: 'from-cyan-500 to-blue-500' },
    { slug: 'food', name: t('categories.foodWine'), icon: '🍷', color: 'from-purple-500 to-pink-500' },
    { slug: 'photography', name: t('categories.photography'), icon: '📸', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero секция */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t.rich('hero.title', {
                highlight: (chunks) => (
                  <span className="text-yellow-300">{chunks}</span>
                )
              })}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Поиск */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Link href={`/${locale}/explore`}>
                  <Button size="lg" className="w-full md:w-auto">
                    {t('hero.searchButton')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-blue-200">{t('hero.tours')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">{t('hero.countries')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-blue-200">{t('hero.travelers')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/explore?category=${category.slug}`}
              >
                <Card className="text-center p-6 cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Рекомендуемые туры */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('featured.title')}
              </h2>
              <p className="text-gray-600">
                {t('featured.subtitle')}
              </p>
            </div>
            <Link href={`/${locale}/explore`}>
              <Button variant="outline">
                {t('featured.viewAll')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-64" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.map((tour) => (
                <Link key={tour.id} href={`/${locale}/tours/${tour.id}`}>
                  <Card className="overflow-hidden cursor-pointer group">
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                      {tour.media && tour.media.length > 0 ? (
                        <Image
                          src={getMediaUrl(tour.media[0].url)}
                          alt={tour.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Compass className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3">
                        {getCategoryLabel(tour.category, locale)}
                      </Badge>
                      {tour.media && tour.media.length > 1 && (
                        <span className="absolute bottom-3 left-3 bg-black/55 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                          +{tour.media.length} фото
                        </span>
                      )}
                      <div className="absolute top-3 right-3">
                        <TourChatWidget tour={tour} variant="icon" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {getLocalizedTour(tour, locale).city}, {getLocalizedTour(tour, locale).country}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {getLocalizedTour(tour, locale).title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{tour.averageRating || 'New'}</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(tour.basePrice)}
                          <span className="text-sm font-normal text-gray-500">
                            {t('featured.perPerson')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Compass className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{t('featured.noTours')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/register`}>
              <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('cta.startJourney')}
              </Button>
            </Link>
            <Link href={`/${locale}/explore`}>
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {t('cta.browseTours')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}