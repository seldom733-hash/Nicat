'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Compass,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import api from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
  pendingTours: number;
  activeUsers: number;
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  isStripeConnected: boolean;
}

interface AdminTour {
  id: string;
  title: string;
  host: { firstName: string; lastName: string };
  country: string;
  city: string;
  status: string;
  basePrice: number;
  bookingCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tours, setTours] = useState<AdminTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tours'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes, toursRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/tours'),
        ]);

        if (statsRes.status === 'fulfilled') {
          const statsData = statsRes.value.data?.data || statsRes.value.data;
          setStats(statsData);
        }
        if (usersRes.status === 'fulfilled') {
          const usersData = usersRes.value.data?.data || usersRes.value.data;
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
        if (toursRes.status === 'fulfilled') {
          const toursData = toursRes.value.data?.data || toursRes.value.data;
          setTours(Array.isArray(toursData) ? toursData : []);
        }
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router]);

  const handleApproveTour = async (tourId: string) => {
    try {
      await api.patch(`/admin/tours/${tourId}/status`, { status: 'active' });
      setTours((prev) =>
        prev.map((t) => (t.id === tourId ? { ...t, status: 'active' } : t))
      );
    } catch {
      alert('Error approving tour');
    }
  };

  const handleRejectTour = async (tourId: string) => {
    try {
      await api.patch(`/admin/tours/${tourId}/status`, { status: 'rejected' });
      setTours((prev) =>
        prev.map((t) => (t.id === tourId ? { ...t, status: 'rejected' } : t))
      );
    } catch {
      alert('Error rejecting tour');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTours = tours.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-red-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600">Manage the Nicat platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              Administrator
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tours', label: 'Tours', icon: Compass },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Users</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalUsers}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-950/10 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary-700" />
                      </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Active: {stats.activeUsers}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Tours</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTours}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-950/10 rounded-xl flex items-center justify-center">
                        <Compass className="h-6 w-6 text-primary-700" />
                      </div>
                    </div>
                    <p className="text-sm text-accent-600 mt-2">
                      Pending: {stats.pendingTours}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalBookings}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(stats.totalRevenue)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-accent-500/15 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-accent-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-accent-500" />
                    Tours Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tours.filter((t) => t.status === 'draft').length > 0 ? (
                    <div className="space-y-3">
                      {tours
                        .filter((t) => t.status === 'draft')
                        .slice(0, 5)
                        .map((tour) => (
                          <div
                            key={tour.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{tour.title}</p>
                              <p className="text-sm text-gray-500">
                                {tour.host.firstName} {tour.host.lastName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApproveTour(tour.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRejectTour(tour.id)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No tours pending review
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary-600" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {users.length > 0 ? (
                    <div className="space-y-3">
                      {users.slice(0, 5).map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                              {u.firstName[0]}
                              {u.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {u.role === 'admin' ? 'Admin' : u.role === 'host' ? 'Host' : 'Traveler'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No users found
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stripe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                {u.firstName[0]}
                                {u.lastName[0]}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {u.firstName} {u.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                u.role === 'admin'
                                  ? 'bg-red-100 text-red-700'
                                  : u.role === 'host'
                                  ? 'bg-primary-950/10 text-primary-800'
                                  : 'bg-primary-950/10 text-primary-800'
                              }
                            >
                              {u.role === 'admin'
                                ? 'Admin'
                                : u.role === 'host'
                                ? 'Host'
                                : 'Traveler'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.isStripeConnected ? (
                              <Badge className="bg-green-100 text-green-700">
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not Connected</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(u.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Tours ({filteredTours.length})
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tour
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Host
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTours.map((tour) => (
                        <tr key={tour.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">
                                {tour.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tour.city}, {tour.country}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tour.host.firstName} {tour.host.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(tour.status)}>
                              {getStatusLabel(tour.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatPrice(tour.basePrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <Link href={`/tours/${tour.id}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {tour.status === 'draft' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApproveTour(tour.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRejectTour(tour.id)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
