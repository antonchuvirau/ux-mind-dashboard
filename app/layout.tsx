import { Inter } from 'next/font/google';

import Header from '@/components/header';

import { Toaster } from '@/components/ui/sonner';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'UXMind Business',
    template: '%s | UXMind Business',
  },
  description: 'Admin UI for UXMind business',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
