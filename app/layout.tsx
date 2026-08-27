import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HumanSenses — Sense Organ Health Platform',
  description:
    'A premium healthcare platform focused on the five human sense organs and SDG 3. Self-assessments, AI guidance, emergency care, and trusted resources.',
  openGraph: {
    title: 'HumanSenses — Sense Organ Health Platform',
    description:
      'Comprehensive health education for your eyes, ears, nose, tongue, and skin.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
