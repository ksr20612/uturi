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
      console.log(`데이터를 ${methodType} 방식으로 변환합니다:`, SAMPLES);
      console.log('설정:', config);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext 상태:', audioContext.state);

      if (audioContext.state === 'suspended') {
        console.log('AudioContext가 suspended 상태입니다. resume()을 호출합니다.');
        await audioContext.resume();
      }

      const result = await sonify([...SAMPLES], methodType, config);

      console.log('Sonification 결과:', result);
    } catch (error) {
      console.error('Sonification error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [method, config]);

  return (
    <Box as="section" bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack gap={4} align="stretch">
        <Text as="h2" fontWeight="bold" mb={2}>
          데모
        </Text>
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
            <Select.Label fontSize="md">변환 방법</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="변환 방법 선택" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {SONIFICATION_LIST_COLLECTION.items.map((method) => (
                    <Select.Item item={method} key={method.value}>
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
          <Accordion.Item value="item-1">
            <Accordion.ItemTrigger>
              <Span flex={1}>고급 옵션</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <VStack gap={6} align="stretch">
                  <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        mb={3}
                        color="gray.700"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        pb={2}
                      >
                        기본 설정
                      </Text>
                      <VStack gap={3}>
                        <Field.Root>
                          <Field.Label>샘플링레이트</Field.Label>
                          <InputGroup endElement="Hz">
                            <Input
                              size="sm"
                              value={config.sampleRate?.toLocaleString()}
                              onChange={handleChangeConfig('sampleRate')}
                              placeholder="44100"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>오디오 길이</Field.Label>
                          <InputGroup endElement="초">
                            <Input
                              size="sm"
                              value={config.duration?.toLocaleString()}
                              onChange={handleChangeConfig('duration')}
                              placeholder="2.0"
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
                        color="gray.700"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        pb={2}
                      >
                        주파수 설정
                      </Text>
                      <VStack gap={3}>
                        <Field.Root>
                          <Field.Label>기본 주파수</Field.Label>
                          <InputGroup endElement="Hz">
                            <Input
                              size="sm"
                              value={config.frequency?.toLocaleString()}
                              onChange={handleChangeConfig('frequency')}
                              placeholder="825"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최소 주파수</Field.Label>
                          <InputGroup endElement="Hz">
                            <Input
                              size="sm"
                              value={config.minFrequency?.toLocaleString()}
                              onChange={handleChangeConfig('minFrequency')}
                              placeholder="150"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최대 주파수</Field.Label>
                          <InputGroup endElement="Hz">
                            <Input
                              size="sm"
                              value={config.maxFrequency?.toLocaleString()}
                              onChange={handleChangeConfig('maxFrequency')}
                              placeholder="1500"
                            />
                          </InputGroup>
                        </Field.Root>
                      </VStack>
                    </Box>
                  </Box>

                  <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        mb={3}
                        color="gray.700"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        pb={2}
                      >
                        볼륨 설정
                      </Text>
                      <VStack gap={3}>
                        <Field.Root>
                          <Field.Label>기본 볼륨</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.volume?.toLocaleString()}
                              onChange={handleChangeConfig('volume')}
                              placeholder="0.3"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최소 볼륨</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.minVolume?.toLocaleString()}
                              onChange={handleChangeConfig('minVolume')}
                              placeholder="0.1"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최대 볼륨</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.maxVolume?.toLocaleString()}
                              onChange={handleChangeConfig('maxVolume')}
                              placeholder="0.5"
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
                        color="gray.700"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        pb={2}
                      >
                        리듬 설정
                      </Text>
                      <VStack gap={3}>
                        <Field.Root>
                          <Field.Label>기본 리듬</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.rhythm?.toLocaleString()}
                              onChange={handleChangeConfig('rhythm')}
                              placeholder="0.5"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최소 리듬</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.minRhythm?.toLocaleString()}
                              onChange={handleChangeConfig('minRhythm')}
                              placeholder="0.1"
                            />
                          </InputGroup>
                        </Field.Root>
                        <Field.Root>
                          <Field.Label>최대 리듬</Field.Label>
                          <InputGroup endElement="(0-1)">
                            <Input
                              size="sm"
                              value={config.maxRhythm?.toLocaleString()}
                              onChange={handleChangeConfig('maxRhythm')}
                              placeholder="1"
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
          소리로 듣기
        </Button>
      </VStack>
    </Box>
  );
}

export default DemoSection;
