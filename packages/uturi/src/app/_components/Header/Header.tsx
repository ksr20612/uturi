'use client';

import { Box, Link as ChakraLink, Container, Heading, Stack } from '@chakra-ui/react';
import Link from 'next/link';

import ROUTES from '../../_constants/Routes';

export function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      bg="rgba(255, 255, 255, 0.6)"
      backdropFilter="blur(4px)"
      borderBottom="1px solid"
      borderColor="gray.200"
      zIndex={50}
    >
      <Container py={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="lg" fontWeight="bold" color="primary.500">
            Uturi
          </Heading>

          <Stack direction="row" gap={8} display={{ base: 'none', md: 'flex' }}>
            {ROUTES.map((item) => (
              <Link key={item.url} href={item.url} passHref>
                <ChakraLink
                  color="gray.600"
                  _hover={{ color: 'primary.500' }}
                  transition="color 0.3s ease"
                  textDecoration="none"
                >
                  {item.label}
                </ChakraLink>
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
