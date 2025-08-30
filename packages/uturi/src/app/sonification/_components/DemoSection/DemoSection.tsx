/* eslint-disable no-console */
'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';

import { Chart, useChart } from '@chakra-ui/charts';
import type { AccordionValueChangeDetails } from '@chakra-ui/react/accordion';
import { Accordion } from '@chakra-ui/react/accordion';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';
import { Field } from '@chakra-ui/react/field';
import { Input } from '@chakra-ui/react/input';
import { InputGroup } from '@chakra-ui/react/input-group';
import { Portal } from '@chakra-ui/react/portal';
import { Select, type SelectValueChangeDetails } from '@chakra-ui/react/select';
import { Span } from '@chakra-ui/react/span';
import { VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

import type { SonificationConfig } from '@uturi/sonification';
import { sonify } from '@uturi/sonification';

import { CartesianGrid, Line, LineChart, Tooltip, YAxis } from 'recharts';

import SAMPLES from '@/app/sonification/_constants/Samples';
import {
  DEFAULT_CONFIG,
  SONIFICATION_LIST_COLLECTION,
  SonificationMethod,
} from '@/app/sonification/_constants/SonificationOptions';

function DemoSection() {
  const [method, setMethod] = useState<SonificationMethod[]>([SonificationMethod.MELODY]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isAccordionOpen, setIsAccordionOpen] = useState<string[]>([]);
  const [config, setConfig] = useState<SonificationConfig>(DEFAULT_CONFIG);

  const chart = useChart({
    data: SAMPLES.map((value) => ({
      value,
    })),
    series: [
      {
        name: 'value',
        color: 'teal.solid',
      },
    ],
  });

  const handleChangeMethod = (details: SelectValueChangeDetails) => {
    setMethod(details.value as SonificationMethod[]);
  };

  const handleChangeAccordion = (details: AccordionValueChangeDetails) => {
    setIsAccordionOpen(details.value);
  };

  const handleChangeConfig =
    (key: keyof SonificationConfig) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');

      setConfig((prev) => ({ ...prev, [key]: value }));
    };

  const handlePlay = useCallback(async () => {
    try {
      setIsPlaying(true);
      const methodType = method[0];
      console.log(`Converting data using ${methodType} method:`, SAMPLES);
      console.log('Configuration:', config);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext status:', audioContext.state);

      if (audioContext.state === 'suspended') {
        console.log('AudioContext is suspended. Calling resume().');
        await audioContext.resume();
      }

      const result = await sonify([...SAMPLES], methodType, config);

      console.log('Sonification result:', result);
    } catch (error) {
      console.error('Sonification error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [method, config]);

  return (
    <Box as="section">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="white" mb={6}>
        Interactive Demo
      </Text>

      <Box
        bg="gray.800"
        p={8}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.700"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      >
        <VStack gap={4} align="stretch">
          <Box>
            <Chart.Root maxH="sm" chart={chart}>
              <LineChart data={chart.data}>
                <CartesianGrid stroke={chart.color('border')} vertical={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  stroke={chart.color('border')}
                />
                <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
                {chart.series.map((item) => (
                  <Line
                    key={item.name}
                    isAnimationActive={false}
                    dataKey={chart.key(item.name)}
                    stroke={chart.color(item.color)}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </Chart.Root>
          </Box>

          <Box>
            <Select.Root
              size="lg"
              collection={SONIFICATION_LIST_COLLECTION}
              value={method}
              onValueChange={handleChangeMethod}
            >
              <Select.HiddenSelect />
              <Select.Label fontSize="md" color="fg.muted">
                Conversion Method
              </Select.Label>
              <Select.Control>
                <Select.Trigger
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                  }}
                >
                  <Select.ValueText placeholder="Select conversion method" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="gray.700" borderColor="gray.600" color="white">
                    {SONIFICATION_LIST_COLLECTION.items.map((method) => (
                      <Select.Item
                        item={method}
                        key={method.value}
                        color="white"
                        _hover={{ bg: 'gray.600' }}
                        _focus={{ bg: 'gray.600' }}
                      >
                        {method.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>

          <Accordion.Root value={isAccordionOpen} onValueChange={handleChangeAccordion} collapsible>
            <Accordion.Item value="item-1" borderColor="gray.600">
              <Accordion.ItemTrigger>
                <Span flex={1} color="fg.muted">
                  Advanced Options
                </Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <VStack gap={6} align="stretch">
                    <Box
                      display="grid"
                      gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                      gap={6}
                    >
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          mb={3}
                          color="fg.muted"
                          borderBottom="1px solid"
                          borderColor="border.muted"
                          pb={2}
                        >
                          Basic Settings
                        </Text>
                        <VStack gap={3}>
                          <Field.Root>
                            <Field.Label color="fg.muted">Sample Rate</Field.Label>
                            <InputGroup endElement="Hz">
                              <Input
                                size="sm"
                                value={config.sampleRate?.toLocaleString()}
                                onChange={handleChangeConfig('sampleRate')}
                                placeholder="44100"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Audio Duration</Field.Label>
                            <InputGroup endElement="sec">
                              <Input
                                size="sm"
                                value={config.duration?.toLocaleString()}
                                onChange={handleChangeConfig('duration')}
                                placeholder="2.0"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                        </VStack>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          mb={3}
                          color="fg.muted"
                          borderBottom="1px solid"
                          borderColor="border.muted"
                          pb={2}
                        >
                          Frequency Settings
                        </Text>
                        <VStack gap={3}>
                          <Field.Root>
                            <Field.Label color="fg.muted">Base Frequency</Field.Label>
                            <InputGroup endElement="Hz">
                              <Input
                                size="sm"
                                value={config.frequency?.toLocaleString()}
                                onChange={handleChangeConfig('frequency')}
                                placeholder="825"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Min Frequency</Field.Label>
                            <InputGroup endElement="Hz">
                              <Input
                                size="sm"
                                value={config.minFrequency?.toLocaleString()}
                                onChange={handleChangeConfig('minFrequency')}
                                placeholder="150"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Max Frequency</Field.Label>
                            <InputGroup endElement="Hz">
                              <Input
                                size="sm"
                                value={config.maxFrequency?.toLocaleString()}
                                onChange={handleChangeConfig('maxFrequency')}
                                placeholder="1500"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                        </VStack>
                      </Box>
                    </Box>

                    <Box
                      display="grid"
                      gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                      gap={6}
                    >
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          mb={3}
                          color="fg.muted"
                          borderBottom="1px solid"
                          borderColor="border.muted"
                          pb={2}
                        >
                          Volume Settings
                        </Text>
                        <VStack gap={3}>
                          <Field.Root>
                            <Field.Label color="fg.muted">Base Volume</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.volume?.toLocaleString()}
                                onChange={handleChangeConfig('volume')}
                                placeholder="0.3"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Min Volume</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.minVolume?.toLocaleString()}
                                onChange={handleChangeConfig('minVolume')}
                                placeholder="0.1"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Max Volume</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.maxVolume?.toLocaleString()}
                                onChange={handleChangeConfig('maxVolume')}
                                placeholder="0.5"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                        </VStack>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          mb={3}
                          color="fg.muted"
                          borderBottom="1px solid"
                          borderColor="border.muted"
                          pb={2}
                        >
                          Rhythm Settings
                        </Text>
                        <VStack gap={3}>
                          <Field.Root>
                            <Field.Label color="fg.muted">Base Rhythm</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.rhythm?.toLocaleString()}
                                onChange={handleChangeConfig('rhythm')}
                                placeholder="0.5"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Min Rhythm</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.minRhythm?.toLocaleString()}
                                onChange={handleChangeConfig('minRhythm')}
                                placeholder="0.1"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                          <Field.Root>
                            <Field.Label color="fg.muted">Max Rhythm</Field.Label>
                            <InputGroup endElement="(0-1)">
                              <Input
                                size="sm"
                                value={config.maxRhythm?.toLocaleString()}
                                onChange={handleChangeConfig('maxRhythm')}
                                placeholder="1"
                                bg="gray.700"
                                borderColor="gray.600"
                                color="white"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{
                                  borderColor: 'teal.400',
                                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                                }}
                              />
                            </InputGroup>
                          </Field.Root>
                        </VStack>
                      </Box>
                    </Box>
                  </VStack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>

          <Button colorScheme="primary" size="lg" onClick={handlePlay} loading={isPlaying}>
            Convert
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default DemoSection;
