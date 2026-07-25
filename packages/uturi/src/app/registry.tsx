'use client';

import type { PropsWithChildren } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { system } from './theme';

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
