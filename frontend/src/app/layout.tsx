import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nicat - Global Platform for Group Travel',
  description:
    'Discover, create, and join group travel adventures around the world.',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="font-sans">{children}</body>
    </html>
  );
}
