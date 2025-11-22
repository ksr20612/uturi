import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { VStack } from '@chakra-ui/react/stack';

import CodeBlock from '@/app/_components/CodeBlock/CodeBlock';
import { CODE_EXAMPLES } from '@/app/_constants/CodeExamples';

function RuleSection() {
  return (
    <Box as="section">
      <Heading as="h2" fontSize="2xl" fontWeight="bold" color="white" mb={8}>
        Getting Started
      </Heading>

      <VStack gap={6} align="stretch">
        {/* Installation */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Installation
          </Heading>
          <CodeBlock language="bash">{CODE_EXAMPLES.installation}</CodeBlock>
        </Box>

        {/* Quick Start */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Quick Start
          </Heading>
          <VStack gap={4} align="start">
            <Box w="full">
              <CodeBlock language="typescript" title="Vanilla JavaScript / TypeScript">
                {CODE_EXAMPLES.quickStart}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="tsx" title="React">
                {CODE_EXAMPLES.reactHook}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="tsx" title="Vue">
                {CODE_EXAMPLES.vueExample}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="tsx" title="Svelte">
                {CODE_EXAMPLES.svelteExample}
              </CodeBlock>
            </Box>
          </VStack>
        </Box>

        {/* Sonification Methods */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Sonification Methods
          </Heading>
          <VStack gap={4} align="start">
            <Box w="full">
              <CodeBlock
                language="typescript"
                title="1. Frequency - Pitch changes according to value"
              >
                {CODE_EXAMPLES.frequencyMethod}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock
                language="typescript"
                title="2. Volume - Volume changes according to value"
              >
                {CODE_EXAMPLES.volumeMethod}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock
                language="typescript"
                title="3. Rhythm - Rhythm pattern changes according to value"
              >
                {CODE_EXAMPLES.rhythmMethod}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock
                language="typescript"
                title="4. Melody - Musical scale using notes (C, D, E, F, G, A, B)"
              >
                {CODE_EXAMPLES.melodyMethod}
              </CodeBlock>
            </Box>
          </VStack>
        </Box>

        {/* Custom Configuration */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Custom Configuration
          </Heading>
          <VStack gap={4} align="start">
            <Box w="full">
              <CodeBlock language="typescript" title="Initial Configuration">
                {CODE_EXAMPLES.customConfig}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="typescript" title="Dynamic Configuration Update">
                {CODE_EXAMPLES.dynamicConfig}
              </CodeBlock>
            </Box>
          </VStack>
        </Box>

        {/* Manual Audio Playback */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Manual Audio Playback
          </Heading>
          <CodeBlock language="typescript" title="Generate audio and play later">
            {CODE_EXAMPLES.manualPlayback}
          </CodeBlock>
        </Box>

        {/* Error Handling */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Error Handling
          </Heading>
          <CodeBlock language="typescript" title="Proper error handling pattern">
            {CODE_EXAMPLES.errorHandling}
          </CodeBlock>
        </Box>

        {/* Real-time Data */}
        {/* <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            📈 Real-time Data Processing
          </Heading>
          <CodeBlock language="typescript" title="Live Chart with Audio Feedback">
            {CODE_EXAMPLES.realTimeData}
          </CodeBlock>
        </Box> */}

        {/* Accessibility */}
        {/* <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            ♿ Accessibility Integration
          </Heading>
          <CodeBlock language="typescript" title="Screen Reader + Audio Chart">
            {CODE_EXAMPLES.accessibilityUse}
          </CodeBlock>
        </Box> */}
      </VStack>
    </Box>
  );
}

export default RuleSection;
