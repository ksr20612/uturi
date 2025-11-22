/* eslint-disable no-console */
'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Chart, useChart } from '@chakra-ui/charts';
import type { AccordionValueChangeDetails } from '@chakra-ui/react/accordion';
import { Accordion } from '@chakra-ui/react/accordion';
import { Box } from '@chakra-ui/react/box';
import { Button, IconButton } from '@chakra-ui/react/button';
import { Field } from '@chakra-ui/react/field';
import { Flex } from '@chakra-ui/react/flex';
import { Input } from '@chakra-ui/react/input';
import { InputGroup } from '@chakra-ui/react/input-group';
import { Portal } from '@chakra-ui/react/portal';
import { Select, type SelectValueChangeDetails } from '@chakra-ui/react/select';
import { Span } from '@chakra-ui/react/span';
import { VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

import type { SonifierConfig } from '@uturi/sonification';
import { useSonifier } from '@uturi/sonification/react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import { CartesianGrid, Line, LineChart, Tooltip, YAxis } from 'recharts';

import {
  DEFAULT_CONFIG,
  SONIFICATION_LIST_COLLECTION,
  SonificationMethod,
} from '@/app/sonification/_constants/SonificationOptions';

import ChakraTooltip from '../../../_components/Tooltip/Tooltip';

function DemoSection() {
  const [method, setMethod] = useState<SonificationMethod[]>([SonificationMethod.MELODY]);
  const [isAccordionOpen, setIsAccordionOpen] = useState<string[]>([]);
  const [config, setConfig] = useState<SonifierConfig>(DEFAULT_CONFIG);
  const [inputValues, setInputValues] = useState<Partial<Record<keyof SonifierConfig, string>>>({});
  const [dataSamples, setDataSamples] = useState<number[]>([
    100, 105, 98, 112, 108, 115, 120, 118, 125, 130, 136, 140, 145,
  ]);

  const { sonify, isPlaying, setConfig: updateConfig } = useSonifier(config);
  const configUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chart = useChart({
    data: dataSamples.map((value) => ({
      value,
    })),
    series: [
      {
        name: 'value',
        color: 'teal.solid',
      },
    ],
  });

  const handleChangeMethod = useCallback((details: SelectValueChangeDetails) => {
    setMethod(details.value as SonificationMethod[]);
  }, []);

  const handleChangeAccordion = useCallback((details: AccordionValueChangeDetails) => {
    setIsAccordionOpen(details.value);
  }, []);

  const handleChangeConfig = useCallback(
    (key: keyof SonifierConfig) => (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const cleanedValue = rawValue.replace(/[^0-9.]/g, '');

      setInputValues((prev) => ({ ...prev, [key]: cleanedValue }));

      if (cleanedValue === '' || cleanedValue === '.') {
        setConfig((prev) => ({ ...prev, [key]: undefined }));
        return;
      }

      const numValue = Number(cleanedValue);

      if (!isNaN(numValue) && isFinite(numValue)) {
        setConfig((prev) => ({ ...prev, [key]: numValue }));
      }
    },
    [],
  );

  const handleBlurConfig = useCallback(
    (key: keyof SonifierConfig) => () => {
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    },
    [],
  );

  const getInputValue = useCallback(
    (key: keyof SonifierConfig): string => {
      if (inputValues[key] !== undefined) {
        return inputValues[key];
      }

      const value = config[key];
      return value !== undefined ? String(value) : '';
    },
    [inputValues, config],
  );

  const handlePlay = useCallback(async () => {
    try {
      const methodType = method[0];
      console.log(`Converting data using ${methodType} method:`, dataSamples);
      console.log('Configuration:', config);

      const result = await sonify([...dataSamples], methodType, {
        autoPlay: true,
      });

      console.log('Sonification result:', result);
    } catch (error) {
      console.error('Sonification error:', error);
    }
  }, [dataSamples, method, sonify, config]);

  const handleClickShuffle = useCallback(() => {
    const shuffledData = Array.from({ length: 13 }, () => Math.floor(Math.random() * 100) + 50);
    setDataSamples(shuffledData);
  }, []);

  useEffect(() => {
    if (configUpdateTimeoutRef.current) {
      clearTimeout(configUpdateTimeoutRef.current);
    }

    configUpdateTimeoutRef.current = setTimeout(() => {
      updateConfig(config);
    }, 500);

    return () => {
      if (configUpdateTimeoutRef.current) {
        clearTimeout(configUpdateTimeoutRef.current);
      }
    };
  }, [config, updateConfig]);

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
                                value={getInputValue('sampleRate')}
                                onChange={handleChangeConfig('sampleRate')}
                                onBlur={handleBlurConfig('sampleRate')}
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
                                value={getInputValue('duration')}
                                onChange={handleChangeConfig('duration')}
                                onBlur={handleBlurConfig('duration')}
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
                                value={getInputValue('frequency')}
                                onChange={handleChangeConfig('frequency')}
                                onBlur={handleBlurConfig('frequency')}
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
                                value={getInputValue('minFrequency')}
                                onChange={handleChangeConfig('minFrequency')}
                                onBlur={handleBlurConfig('minFrequency')}
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
                                value={getInputValue('maxFrequency')}
                                onChange={handleChangeConfig('maxFrequency')}
                                onBlur={handleBlurConfig('maxFrequency')}
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
                                value={getInputValue('volume')}
                                onChange={handleChangeConfig('volume')}
                                onBlur={handleBlurConfig('volume')}
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
                                value={getInputValue('minVolume')}
                                onChange={handleChangeConfig('minVolume')}
                                onBlur={handleBlurConfig('minVolume')}
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
                                value={getInputValue('maxVolume')}
                                onChange={handleChangeConfig('maxVolume')}
                                onBlur={handleBlurConfig('maxVolume')}
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
                                value={getInputValue('rhythm')}
                                onChange={handleChangeConfig('rhythm')}
                                onBlur={handleBlurConfig('rhythm')}
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
                                value={getInputValue('minRhythm')}
                                onChange={handleChangeConfig('minRhythm')}
                                onBlur={handleBlurConfig('minRhythm')}
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
                                value={getInputValue('maxRhythm')}
                                onChange={handleChangeConfig('maxRhythm')}
                                onBlur={handleBlurConfig('maxRhythm')}
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

          <Flex gap={4} wrap="wrap">
            <ChakraTooltip content="Shuffle data">
              <IconButton size="lg" aria-label="shuffle data" onClick={handleClickShuffle}>
                <GiPerspectiveDiceSixFacesRandom />
              </IconButton>
            </ChakraTooltip>
            <Button
              colorScheme="primary"
              size="lg"
              onClick={handlePlay}
              loading={isPlaying}
              loadingText="Playing..."
              flex={1}
            >
              Sonify
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

export default DemoSection;
