import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
import { Heading } from '@chakra-ui/react/heading';
import { VStack } from '@chakra-ui/react/stack';
import { Table } from '@chakra-ui/react/table';
import { Text } from '@chakra-ui/react/text';
import { HiExclamationTriangle } from 'react-icons/hi2';

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
          <VStack gap={4} align="start">
            <Box w="full">
              <CodeBlock language="bash" title="Global Installation">
                {CODE_EXAMPLES.installation}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="bash" title="Framework-Specific Installation (RECOMMENDED)">
                {CODE_EXAMPLES.installationParticular}
              </CodeBlock>
            </Box>
          </VStack>
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

        {/* Waveform Types */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Heading as="h3" size="md" mb={4} color="white">
            Waveform Types
          </Heading>
          <VStack gap={4} align="stretch">
            <VStack gap={2} align="start">
              <Flex gap={1} align="center">
                <HiExclamationTriangle color="var(--chakra-colors-yellow-400)" size={20} />
                <Heading as="h4" size="md" color="white">
                  Notice
                </Heading>
              </Flex>
              <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                When choosing a Waveform Type, carefully consider both{' '}
                <strong> the acoustic characteristics of the sound</strong> and{' '}
                <strong>the nature of the data you want to convey</strong>. Each waveform has
                distinct auditory properties, and the appropriate waveform varies depending on the
                data characteristics.
              </Text>
            </VStack>
            <Box overflowX="auto">
              <Table.Root variant="outline" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader color="white" borderColor="gray.600">
                      Waveform
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="white" borderColor="gray.600">
                      Characteristics
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="white" borderColor="gray.600">
                      Change Detection Accuracy
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="white" borderColor="gray.600">
                      Auditory Fatigue
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="white" borderColor="gray.600">
                      Suitable Use Cases
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell
                      fontWeight="semibold"
                      color="white"
                      borderColor="gray.600"
                      bg="gray.750"
                    >
                      Sine
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Smooth and pure tone
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Change Detection Accuracy: 5 out of 5"
                    >
                      ★★★★★
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Auditory Fatigue: 5 out of 5"
                    >
                      ★★★★★
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Common values, key data with slopes
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell
                      fontWeight="semibold"
                      color="white"
                      borderColor="gray.600"
                      bg="gray.750"
                    >
                      Square
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Strong attack, abrupt transitions
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Change Detection Accuracy: 3 out of 5"
                    >
                      ★★★☆☆
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Auditory Fatigue: 2 out of 5"
                    >
                      ★★☆☆☆
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Outliers, warnings, state transitions
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell
                      fontWeight="semibold"
                      color="white"
                      borderColor="gray.600"
                      bg="gray.750"
                    >
                      Sawtooth
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Clear rise/fall, strong harmonics
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Change Detection Accuracy: 2 out of 5"
                    >
                      ★★☆☆☆
                    </Table.Cell>
                    <Table.Cell
                      color="gray.300"
                      borderColor="gray.600"
                      aria-label="Auditory Fatigue: 2 out of 5"
                    >
                      ★★☆☆☆
                    </Table.Cell>
                    <Table.Cell color="gray.300" borderColor="gray.600">
                      Enhanced slope/trend recognition
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Box>
            <CodeBlock language="typescript" title="Choose from three waveform types">
              {CODE_EXAMPLES.waveformTypes}
            </CodeBlock>
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
          <VStack gap={4} align="start">
            <Box w="full">
              <CodeBlock language="typescript" title="SonificationError Class">
                {CODE_EXAMPLES.errorHandlingSonificationError}
              </CodeBlock>
            </Box>
            <Box w="full">
              <CodeBlock language="typescript" title="Basic Error Handling">
                {CODE_EXAMPLES.errorHandling}
              </CodeBlock>
            </Box>
          </VStack>
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
