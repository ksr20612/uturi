import { Box } from '@chakra-ui/react';

import HeroSection from './_components/MainContents/HeroSection/HeroSection';
import ToolSection from './_components/MainContents/ToolSection/ToolSection';

export default function Home() {
  return (
    <Box bg="gray.50" minH="100vh">
      <HeroSection />
      <ToolSection />
    </Box>
  );
}
