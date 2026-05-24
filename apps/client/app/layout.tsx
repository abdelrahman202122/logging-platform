import type { Metadata } from 'next';
import { Nunito_Sans, IBM_Plex_Mono } from 'next/font/google';

import { Providers } from '@/app/providers';

import './globals.css';

const nuntoSans = Nunito_Sans({
  variable: '--font-nunto-sans',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Logging Platform',
  description: 'Developer dashboard for managing applications and logs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nuntoSans.variable} ${ibmPlexMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
