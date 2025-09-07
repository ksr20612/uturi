'use client';

import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import Link from 'next/link';

import ROUTES from '../../_constants/Routes';

export function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      bg="rgba(17, 24, 39, 0.8)"
      backdropFilter="blur(4px)"
      borderBottom="1px solid"
      borderColor="border.DEFAULT"
      zIndex={50}
    >
      <Container py={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="lg" fontWeight="bold" color="primary.text">
            UTURI
          </Heading>

          <Stack direction="row" gap={8} display={{ base: 'none', md: 'flex' }}>
            {ROUTES.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <Box
                  as="span"
                  color="fg.muted"
                  _hover={{ color: 'primary.text' }}
                  transition="color 0.3s ease"
                  cursor="pointer"
                >
                  {item.label}
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
