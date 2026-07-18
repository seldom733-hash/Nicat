import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
    failed: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    paid: 'Paid',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    failed: 'Failed',
    active: 'Active',
    draft: 'Draft',
    paused: 'Paused',
  };
  return labels[status] || status;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    adventure: 'Adventure',
    cultural: 'Cultural',
    nature: 'Nature',
    city: 'City',
    beach: 'Beach',
    food: 'Food & Wine',
    photography: 'Photography',
    wellness: 'Wellness',
    family: 'Family',
    luxury: 'Luxury',
    budget: 'Budget',
  };
  return labels[category] || category;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: 'Easy',
    moderate: 'Moderate',
    challenging: 'Challenging',
    difficult: 'Very Difficult',
  };
  return labels[difficulty] || difficulty;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NC-${timestamp}-${random}`;
}
