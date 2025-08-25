import { Box, Container, VStack } from '@chakra-ui/react';

import DemoSection from '@/app/sonification/_components/DemoSection/DemoSection';
import IntroSection from '@/app/sonification/_components/IntroSection/IntroSection';
import RuleSection from '@/app/sonification/_components/RuleSection/RuleSection';

export default function SonificationPage() {
  return (
    <Box as="main" py={8} bg="gray.50" minH="100vh">
      <Container maxW="4xl">
        <VStack gap={8} align="stretch">
          <IntroSection />
          <DemoSection />
          <RuleSection />
        </VStack>
      </Container>
    </Box>
  );
}
