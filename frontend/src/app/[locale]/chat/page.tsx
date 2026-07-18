'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatPage() {
  const t = useTranslations('chat');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">{t('noMessages')}</p>
          <p className="text-sm text-gray-400">{t('startConversation')}</p>
        </div>
      </div>
    </div>
  );
}
