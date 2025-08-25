import { Box, Container, Heading, Text, VStack, VisuallyHidden } from '@chakra-ui/react';

import TOOLS from '@/app/_constants/Tools';

import ToolCard from './ToolCard/ToolCard';

function ToolSection() {
  return (
    <Box as="section" bg="gray.50">
      <Container maxW="7xl">
        <VStack gap={12} align="stretch">
          <VisuallyHidden textAlign="center">
            <Heading as="h2" id="tools-heading">
              접근성 도구들
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
                bg="white"
                borderRadius="lg"
                p={6}
                shadow="md"
                _hover={{ shadow: 'xl' }}
                transition="all 0.3s"
                h="full"
                display="flex"
                flexDirection="column"
              >
                <ToolCard {...tool} />
              </Box>
            ))}
          </Box>

          <Box textAlign="center" py={8}>
            <Text as="p" fontSize="lg" color="gray.500">
              더 많은 접근성 도구들이 개발 중입니다.
              <Text as="span" color="primary.500" fontWeight="semibold">
                GitHub
              </Text>
              에서 최신 소식을 확인하세요.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default ToolSection;
