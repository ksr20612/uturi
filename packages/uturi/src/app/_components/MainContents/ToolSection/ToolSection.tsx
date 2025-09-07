import { Box, Container, Heading, Text, VStack, VisuallyHidden } from '@chakra-ui/react';

import TOOLS from '@/app/_constants/Tools';

import ToolCard from './ToolCard/ToolCard';

function ToolSection() {
  return (
    <Box as="section" bg="bg.DEFAULT">
      <Container maxW="7xl">
        <VStack gap={12} align="stretch">
          <VisuallyHidden textAlign="center">
            <Heading as="h2" id="tools-heading">
              Accessibility Tools
            </Heading>
          </VisuallyHidden>

          <Box
            as="ul"
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={8}
            aria-labelledby="tools-heading"
          >
            {TOOLS.map((tool) => (
              <Box
                as="li"
                key={tool.id}
                bg="gray.800"
                borderRadius="xl"
                p={6}
                border="1px solid"
                borderColor="gray.700"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                _hover={{
                  transform: 'translateY(-8px) rotate(-1deg)',
                  boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.7)',
                  borderColor: 'gray.600',
                }}
                transition="all 0.3s ease"
                h="full"
                display="flex"
                flexDirection="column"
              >
                <ToolCard {...tool} />
              </Box>
            ))}
          </Box>

          <Box textAlign="center" py={8}>
            <Text as="p" fontSize="lg" color="fg.subtle">
              More accessibility tools are in development. Check{' '}
              <Text as="span" color="primary.text" fontWeight="semibold">
                GitHub
              </Text>{' '}
              for the latest updates.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default ToolSection;
