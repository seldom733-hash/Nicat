'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, Users, CreditCard, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toursApi, bookingsApi, paymentsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Tour } from '@/lib/api';
import Link from 'next/link';

interface PassengerForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [tour, setTour] = useState<Tour | null>(null);
  const [step, setStep] = useState(1);
  const [tourDate, setTourDate] = useState('');
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { firstName: '', lastName: '', dateOfBirth: '', nationality: '', passportNumber: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = useTranslations('booking');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await toursApi.getById(params.tourId as string);
        setTour(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (params.tourId) fetchTour();
  }, [params.tourId]);

  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '', dateOfBirth: '', nationality: '', passportNumber: '' }]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    return tour.basePrice * passengers.length;
  };

  const handleSubmit = async () => {
    if (!tour || !user) return;
    setIsLoading(true);
    setError('');

    try {
      const booking = await bookingsApi.create({
        tourId: tour.id,
        tourDate,
        numberOfPassengers: passengers.length,
        passengers: passengers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dateOfBirth || '2000-01-01',
          gender: 'other',
          nationality: p.nationality || 'Unknown',
          passportNumber: p.passportNumber,
        })),
      });

      const payment = await paymentsApi.initiate(booking.id);

      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      } else {
        router.push(`/${locale}/booking/confirmation/${booking.id}`);
      }
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/tours/${tour.id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {tCommon('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

            <div className="flex items-center mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('title')}</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('passengers')} {index + 1}
                        </h3>
                        {passengers.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removePassenger(index)}>
                            {tCommon('delete')}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')}</label>
                          <Input
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName')}</label>
                          <Input
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('passport')}</label>
                        <Input
                          value={passenger.passportNumber}
                          onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" onClick={addPassenger} className="w-full">
                  {t('addPassenger')}
                </Button>
              </div>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('payment')}</h2>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('total')}</span>
                      <span className="font-bold text-lg">${calculateTotal()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {tCommon('back')}
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} className="ml-auto">
                  {tCommon('next')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="ml-auto">
                  {isLoading ? '...' : t('confirmBooking')}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('tourDetails')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{tour.startDate} - {tour.endDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{passengers.length} {t('passengers')}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('total')}</span>
                      <span className="font-bold text-xl text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}