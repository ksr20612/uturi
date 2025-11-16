import { Box, Button, Container, Heading, Text, VisuallyHidden } from '@chakra-ui/react';
import NextLink from 'next/link';

import ROUTES from '../../../_constants/Routes';

function HeroSection() {
  return (
    <Box
      as="section"
      py={20}
      px={{ base: 4, sm: 6, lg: 8 }}
      bg="gray.900"
      position="relative"
      overflow="hidden"
      role="banner"
      aria-labelledby="hero-heading"
    >
      <Container maxW="7xl">
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={12}
          alignItems="center"
        >
          <Box>
            <Heading
              as="h1"
              id="hero-heading"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              mb={6}
            >
              <Box as="span" color="fg.muted">
                Innovative{' '}
              </Box>
              <Box
                as="span"
                style={{
                  background: 'linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Accessibility{' '}
              </Box>
              <Box as="span" color="fg.muted">
                for{' '}
              </Box>
              <Box
                as="span"
                style={{
                  background: 'linear-gradient(to right, #facc15, #f97316, #ef4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Everyone
              </Box>
            </Heading>

            <Text
              as="p"
              fontSize={{ base: 'lg', md: 'xl' }}
              color="fg.muted"
              mb={8}
              maxW="xl"
              lineHeight="1.6"
              id="hero-description"
            >
              UTURI provides cutting-edge tools and libraries to make digital content accessible to
              all users. Transform data into sound, ensure visual accessibility, and build inclusive
              experiences.
            </Text>

            <Box display="flex" gap={4} flexWrap="wrap">
              <NextLink href={ROUTES[1].url} passHref>
                <Button
                  size="2xl"
                  bg="primary.500"
                  color="fg.muted"
                  px={8}
                  py={4}
                  borderRadius="lg"
                  fontWeight="semibold"
                  fontSize="lg"
                  _hover={{
                    bg: 'primary.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.6)',
                  }}
                  _focus={{
                    bg: 'primary.hover',
                    outline: '3px solid',
                    outlineColor: 'primary.text',
                    outlineOffset: '2px',
                  }}
                  transition="all 0.3s ease"
                  boxShadow="0 4px 14px 0 rgba(20, 184, 166, 0.4)"
                  textDecoration="none"
                  aria-describedby="hero-description"
                  tabIndex={0}
                >
                  Get Started
                </Button>
              </NextLink>
            </Box>
          </Box>

          <Box display={{ base: 'none', lg: 'block' }}>
            <VisuallyHidden>
              Example code showing how to use UTURI sonification library to convert data into sound
            </VisuallyHidden>
            <Box
              bg="gray.800"
              borderRadius="xl"
              p={6}
              border="1px solid"
              borderColor="gray.700"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              transform="rotate(2deg)"
              _hover={{ transform: 'rotate(0deg)' }}
              transition="transform 0.3s ease"
              role="img"
              aria-label="Code example: import Sonifier from @uturi/sonification, create data array with numbers 1, 5, 3, 8, 6, 12, then create Sonifier instance and call sonify method with justNumbers and frequency parameters"
              tabIndex={0}
              _focus={{
                outline: '3px solid',
                outlineColor: 'teal.400',
                outlineOffset: '2px',
                transform: 'rotate(0deg)',
              }}
            >
              <Box display="flex" gap={2} mb={4}>
                <Box w={3} h={3} bg="red.500" borderRadius="full" />
                <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
                <Box w={3} h={3} bg="green.500" borderRadius="full" />
              </Box>
              <Box
                fontFamily="mono"
                fontSize="sm"
                color="gray.300"
                lineHeight="1.8"
                whiteSpace="pre"
              >
                <Box as="div">
                  <Box as="span" color="purple.400">
                    import
                  </Box>
                  <Box as="span" color="gray.400">
                    {' '}
                    {'{ '}
                  </Box>
                  <Box as="span" color="cyan.400">
                    Sonifier
                  </Box>
                  <Box as="span" color="gray.400">
                    {' }'}{' '}
                  </Box>
                  <Box as="span" color="purple.400">
                    from
                  </Box>
                  <Box as="span" color="green.400">
                    {' '}
                    '@uturi/sonification'
                  </Box>
                  ;
                </Box>

                <Box as="div" mt={1}>
                  <Box as="span" color="blue.400">
                    const
                  </Box>
                  <Box as="span" color="yellow.400">
                    {' '}
                    data
                  </Box>
                  <Box as="span" color="gray.400">
                    {' '}
                    ={' '}
                  </Box>
                  <Box as="span" color="orange.400">
                    [1, 5, 3, 8, 6, 12]
                  </Box>
                  ;
                </Box>

                <Box as="div" mt={1}>
                  <Box as="span" color="blue.400">
                    const
                  </Box>
                  <Box as="span" color="yellow.400">
                    {' '}
                    sonifier
                  </Box>
                  <Box as="span" color="gray.400">
                    {' '}
                    ={' '}
                  </Box>
                  <Box as="span" color="purple.400">
                    new
                  </Box>
                  <Box as="span" color="cyan.400">
                    {' '}
                    Sonifier
                  </Box>
                  <Box as="span" color="gray.400">
                    ()
                  </Box>
                  ;
                </Box>

                <Box as="div" mt={1}>
                  <Box as="span" color="purple.400">
                    await
                  </Box>
                  <Box as="span" color="yellow.400">
                    {' '}
                    sonifier
                  </Box>
                  <Box as="span" color="gray.400">
                    .
                  </Box>
                  <Box as="span" color="cyan.400">
                    sonify
                  </Box>
                  <Box as="span" color="gray.400">
                    (
                  </Box>
                  <Box as="span" color="yellow.400">
                    data
                  </Box>
                  <Box as="span" color="gray.400">
                    )
                  </Box>
                  ;
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
