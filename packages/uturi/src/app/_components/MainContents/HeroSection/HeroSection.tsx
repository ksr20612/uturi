import { Box, Container, Heading, Text } from '@chakra-ui/react';

function HeroSection() {
  return (
    <Box as="section" py={10} px={{ base: 2, sm: 3, lg: 4 }}>
      <Container maxW="xl">
        <Box display="flex" flexDirection="column" gap={3} textAlign="center">
          <Heading as="h2" size="2xl">
            접근성을 위한{' '}
            <Box as="span" color="primary.500">
              혁신적인 도구들
            </Box>
          </Heading>
          <Text
            as="p"
            fontSize="xl"
            color="gray.600"
            mb={4}
            maxW="md"
            mx="auto"
            wordBreak="keep-all"
          >
            Uturi는 모든 사용자가 디지털 콘텐츠에 쉽게 접근할 수 있도록 혁신적인 접근성 도구들을
            제공합니다.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
