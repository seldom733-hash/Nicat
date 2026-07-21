'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Calendar, DollarSign, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { dashboardApi } from '@/lib/api';

interface DashboardStats {
  tours: { total: number; active: number };
  bookings: { total: number };
  revenue: { total: number; net: number; commission: number };
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const statsData = await dashboardApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchData();
  }, [isAuthenticated, authLoading, fetchData]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('welcome', { name: user?.firstName || 'User' })}
          </h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-950/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{t('myTours')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.tours.total ?? 0}</p>
                  {stats && stats.tours.active > 0 && (
                    <p className="text-xs text-green-600">{stats.tours.active} active</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{t('myBookings')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.bookings.total ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-accent-500/15 rounded-lg">
                  <DollarSign className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{t('earnings')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats?.revenue.net?.toLocaleString() ?? '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-950/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{t('settings')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
