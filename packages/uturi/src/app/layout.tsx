import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { Header } from '@/app/_components/Header/Header';

import ThemeRegistry from './registry';

export const metadata: Metadata = {
  title: 'Uturi | Accessibility Tools and Libraries',
  description: 'Uturi organization introduction and accessibility tools showcase',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <Header />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
