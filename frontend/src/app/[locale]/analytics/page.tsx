'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  MapPin,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Compass,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';

interface FunnelData {
  funnel: {
    views: number;
    uniqueVisitors: number;
    bookingsStarted: number;
    bookingsPaid: number;
    bookingsCompleted: number;
    bookingsCancelled: number;
  };
  conversion: {
    viewToBooking: string;
    bookingToPaid: string;
    paidToCompleted: string;
    overallConversion: string;
  };
}

interface RevenuePoint {
  date: string;
  grossRevenue: string;
  netRevenue: string;
  commission: string;
  transactions: string;
}

interface TourPerf {
  id: string;
  title: string;
  status: string;
  category: string;
  basePrice: number;
  averageRating: number;
  reviewCount: number;
  views: number;
  uniqueVisitors: number;
  totalBookings: number;
  paidBookings: number;
  revenue: number;
  conversionRate: string;
}

interface GeoPoint {
  tourCountry: string;
  bookings: string;
  revenue: string;
  uniqueUsers: string;
}

interface SourcePoint {
  source: string;
  views: string;
  uniqueVisitors: string;
}

interface MonthlyData {
  currentMonth: { bookings: number; revenue: number; passengers: number };
  lastMonth: { bookings: number; revenue: number; passengers: number };
  growth: { revenue: number; bookings: number };
}

const API_BASE = '/api/v1';

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const t = useTranslations('analytics');
  const locale = useLocale();
  const router = useRouter();

  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [tourPerf, setTourPerf] = useState<TourPerf[]>([]);
  const [geography, setGeography] = useState<GeoPoint[]>([]);
  const [sources, setSources] = useState<SourcePoint[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [days, setDays] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    try {
      const headers = (() => {
        const tokens = localStorage.getItem('tokens');
        if (!tokens) return {};
        const parsed = JSON.parse(tokens);
        return { Authorization: `Bearer ${parsed.accessToken}` };
      })();

      const [funnelRes, revenueRes, tourRes, geoRes, srcRes, monthRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/funnel`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE}/analytics/revenue?period=${period}&days=${days}`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE}/analytics/tours`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE}/analytics/geography`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE}/analytics/sources`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE}/analytics/monthly`, { headers }).then((r) => r.json()),
      ]);

      // Extract .data from TransformInterceptor wrapper { data, timestamp, path }
      const extract = (r: any) => r?.data ?? r;
      const funnelData = extract(funnelRes);
      setFunnel(funnelData?.funnel ? funnelData : null);
      setRevenue(Array.isArray(extract(revenueRes)) ? extract(revenueRes) : []);
      setTourPerf(Array.isArray(extract(tourRes)) ? extract(tourRes) : []);
      setGeography(Array.isArray(extract(geoRes)) ? extract(geoRes) : []);
      setSources(Array.isArray(extract(srcRes)) ? extract(srcRes) : []);
      setMonthly(extract(monthRes));
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [period, days]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchAnalytics();
  }, [isAuthenticated, authLoading, fetchAnalytics]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      </div>
    );
  }

  const fmt = (n: number) => (n || 0).toLocaleString();
  const fmtCurrency = (n: number) => `$${(n || 0).toLocaleString()}`;
  const fmtPercent = (v: string) => `${v}%`;

  const maxRevenue = revenue.length > 0 ? Math.max(...revenue.map((r) => parseFloat(r.grossRevenue || '0')), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {(['day', 'week', 'month'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {t(`period.${p}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Monthly Summary Cards */}
        {monthly?.currentMonth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t('summary.revenue')}</p>
                    <p className="text-2xl font-bold text-gray-900">{fmtCurrency(monthly.currentMonth.revenue)}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${monthly.growth.revenue >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {monthly.growth.revenue >= 0 ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${monthly.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monthly.growth.revenue >= 0 ? '+' : ''}{monthly.growth.revenue}% {t('summary.vsLastMonth')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t('summary.bookings')}</p>
                    <p className="text-2xl font-bold text-gray-900">{monthly.currentMonth.bookings}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className={`text-xs mt-2 ${monthly.growth.bookings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monthly.growth.bookings >= 0 ? '+' : ''}{monthly.growth.bookings}% {t('summary.vsLastMonth')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t('summary.passengers')}</p>
                    <p className="text-2xl font-bold text-gray-900">{monthly.currentMonth.passengers}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{t('summary.thisMonth')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Funnel */}
        {funnel?.funnel && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                {t('funnel.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: t('funnel.views'), value: funnel.funnel.views, color: 'bg-blue-500', width: '100%' },
                  { label: t('funnel.uniqueVisitors'), value: funnel.funnel.uniqueVisitors, color: 'bg-indigo-500', width: '85%' },
                  { label: t('funnel.bookingsStarted'), value: funnel.funnel.bookingsStarted, color: 'bg-violet-500', width: '55%' },
                  { label: t('funnel.bookingsPaid'), value: funnel.funnel.bookingsPaid, color: 'bg-green-500', width: '35%' },
                  { label: t('funnel.bookingsCompleted'), value: funnel.funnel.bookingsCompleted, color: 'bg-emerald-600', width: '25%' },
                  { label: t('funnel.bookingsCancelled'), value: funnel.funnel.bookingsCancelled, color: 'bg-red-400', width: '10%' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-44 text-right">{step.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className={`${step.color} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                        style={{ width: step.width }}
                      >
                        <span className="text-white text-sm font-semibold">{fmt(step.value)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion rates */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {[
                  { label: t('funnel.viewToBooking'), value: fmtPercent(funnel.conversion.viewToBooking) },
                  { label: t('funnel.bookingToPaid'), value: fmtPercent(funnel.conversion.bookingToPaid) },
                  { label: t('funnel.paidToCompleted'), value: fmtPercent(funnel.conversion.paidToCompleted) },
                  { label: t('funnel.overall'), value: fmtPercent(funnel.conversion.overallConversion) },
                ].map((rate, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-primary-700">{rate.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{rate.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revenue Chart */}
        {revenue.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                {t('revenue.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-48">
                {revenue.map((point, i) => {                      const height = (parseFloat(point.grossRevenue || '0') / maxRevenue) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1" title={point.date}>
                      <div
                        className="w-full bg-gradient-to-t from-primary-700 to-primary-500 rounded-t transition-all duration-300 hover:from-primary-800 hover:to-primary-600 cursor-pointer min-h-[2px]"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                      <span className="text-[10px] text-gray-400 truncate w-full text-center">
                        {point.date?.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tour Performance Table */}
        {tourPerf.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Compass className="h-5 w-5 mr-2 text-primary-600" />
                {t('tours.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">{t('tours.name')}</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">{t('tours.views')}</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">{t('tours.bookings')}</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">{t('tours.revenue')}</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">{t('tours.conversion')}</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">{t('tours.rating')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourPerf.map((tour) => (
                      <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">{tour.title}</span>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${
                                tour.status === 'active' ? 'bg-green-100 text-green-700' :
                                tour.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {tour.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 text-gray-600">{fmt(tour.views)}</td>
                        <td className="text-right py-3 px-2 text-gray-600">{tour.totalBookings}</td>
                        <td className="text-right py-3 px-2 font-medium text-gray-900">{fmtCurrency(tour.revenue)}</td>
                        <td className="text-right py-3 px-2">
                          <span className={`font-medium ${parseFloat(tour.conversionRate) > 5 ? 'text-green-600' : parseFloat(tour.conversionRate) > 2 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {tour.conversionRate}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">
                          <span className="text-yellow-500">★</span> {tour.averageRating ? Number(tour.averageRating).toFixed(1) : '—'}
                          <span className="text-gray-400 ml-1">({tour.reviewCount})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geography & Sources side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Geography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                {t('geography.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {geography.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">{t('geography.noData')}</p>
              ) : (
                <div className="space-y-3">
                  {geography.map((geo, i) => {
                    const maxBookings = parseInt(geography[0]?.bookings || '1');
                    const width = (parseInt(geo.bookings) / maxBookings) * 100;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-28 truncate font-medium">{geo.tourCountry}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${width}%` }}
                          >
                            <span className="text-white text-xs font-medium">{geo.bookings}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 w-16 text-right">{fmtCurrency(parseFloat(geo.revenue))}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                {t('sources.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sources.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">{t('sources.noData')}</p>
              ) : (
                <div className="space-y-3">
                  {sources.map((src, i) => {
                    const maxViews = parseInt(sources[0]?.views || '1');
                    const width = (parseInt(src.views) / maxViews) * 100;
                    const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500', 'bg-amber-500'];
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-28 truncate font-medium capitalize">{src.source}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                          <div
                            className={`${colors[i % colors.length]} h-full rounded-full flex items-center justify-end pr-2`}
                            style={{ width: `${width}%` }}
                          >
                            <span className="text-white text-xs font-medium">{src.views}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 w-16 text-right">{src.uniqueVisitors} {t('sources.unique')}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
