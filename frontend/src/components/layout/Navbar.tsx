'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Compass,
  MapPin,
  MessageCircle,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const { user, isAuthenticated, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const tokens = localStorage.getItem('tokens');
      const storedUser = localStorage.getItem('user');

      if (tokens && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          useAuthStore.getState().setUser(userData);
        } catch {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [setLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore error
    }
    logout();
    router.push(`/${locale}`);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { href: `/${locale}/explore`, label: t('explore'), icon: Compass },
    ...(user?.role === 'host' || user?.role === 'admin'
      ? [{ href: `/${locale}/tours/create`, label: t('createTour'), icon: MapPin }]
      : []),
    { href: `/${locale}/chat`, label: t('chats'), icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nicat
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            {isAuthenticated && user ? (
              <>
                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.firstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(user.firstName, user.lastName)
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href={`/${locale}/profile`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t('profile')}
                      </Link>
                      <Link
                        href={`/${locale}/dashboard`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('dashboard')}
                      </Link>
                      <Link
                        href={`/${locale}/chat`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t('chats')}
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="ghost" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/register`}>
                  <Button size="sm">{t('signUp')}</Button>
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholderMobile')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}