import { Box, Container, VStack } from '@chakra-ui/react';

import DemoSection from '@/app/sonification/_components/DemoSection/DemoSection';
import IntroSection from '@/app/sonification/_components/IntroSection/IntroSection';
import RuleSection from '@/app/sonification/_components/RuleSection/RuleSection';

export default function SonificationPage() {
  return (
    <Box as="main" minH="100vh">
      <Container maxW="7xl">
        <VStack gap={0} align="stretch">
          <IntroSection />
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={12}
            mb={12}
            alignItems="start"
          >
            <RuleSection />
            <Box
              position={{ base: 'static', lg: 'sticky' }}
              top={{ base: 'auto', lg: '120px' }}
              alignSelf="start"
            >
              <DemoSection />
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
