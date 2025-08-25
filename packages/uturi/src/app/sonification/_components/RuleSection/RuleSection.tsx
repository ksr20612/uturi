import { Box } from '@chakra-ui/react/box';
import { Code } from '@chakra-ui/react/code';
import { Heading } from '@chakra-ui/react/heading';
import { VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

function RuleSection() {
  return (
    <Box as="section" display="flex" flexDirection="column" gap={4}>
      <Box bg="white" p={6} borderRadius="lg" shadow="md">
        <Heading as="h2" size="md" mb={4}>
          설치
        </Heading>
        <Code p={3} borderRadius="md" bg="gray.100" fontSize="sm" display="block" w="full">
          npm install @uturi/sonification
        </Code>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" shadow="md">
        <Heading as="h2" size="md" mb={4}>
          기본 사용법
        </Heading>
        <VStack gap={4} align="start">
          <Box>
            <Text fontWeight="semibold" mb={2}>
              기본 사용
            </Text>
            <Code p={4} borderRadius="md" bg="gray.100" fontSize="sm" display="block" w="full">
              {`import { sonifyArray } from '@uturi/sonification';

await sonifyArray([1, 2, 3, 4, 5], 'frequency');`}
            </Code>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb={2}>
              설정 커스터마이징
            </Text>
            <Code p={4} borderRadius="md" bg="gray.100" fontSize="sm" display="block" w="full">
              {`await sonifyArray(data, 'frequency', {
frequency: 825,       // 기본 주파수 (Hz)
minFrequency: 150,    // 최소 주파수 (Hz)
maxFrequency: 1500,   // 최대 주파수 (Hz)
volume: 0.3,          // 기본 볼륨 (0-1)
duration: 2.0         // 오디오 길이 (초)
});`}
            </Code>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default RuleSection;
