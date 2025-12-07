import { Box, Container, VStack } from '@chakra-ui/react';

import DemoSection from '@/app/sonification/_components/DemoSection/DemoSection';
import IntroSection from '@/app/sonification/_components/IntroSection/IntroSection';
import RuleSection from '@/app/sonification/_components/RuleSection/RuleSection';

export default function SonificationPage() {
  return (
    <Box as="main" minH="100vh">
      <Container maxW="5xl">
        <VStack gap={12} mb={12} align="stretch">
          <IntroSection />
          <DemoSection />
          <RuleSection />
        </VStack>
      </Container>
    </Box>
  );
}
