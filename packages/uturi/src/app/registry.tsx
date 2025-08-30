'use client';

import type { PropsWithChildren } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

import { system } from './theme';

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
