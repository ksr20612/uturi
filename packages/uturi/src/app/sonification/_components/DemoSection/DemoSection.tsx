/* eslint-disable no-console */
'use client';

import { useCallback, useState } from 'react';

import { Chart, useChart } from '@chakra-ui/charts';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';
import { Portal } from '@chakra-ui/react/portal';
import { Select, type SelectValueChangeDetails } from '@chakra-ui/react/select';
import { VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

import { sonify } from '@uturi/sonification';

import { CartesianGrid, Line, LineChart, Tooltip, YAxis } from 'recharts';

import SAMPLES from '@/app/sonification/_constants/Samples';
import {
  SONIFICATION_LIST_COLLECTION,
  SonificationMethod,
} from '@/app/sonification/_constants/SonificationOptions';

function DemoSection() {
  const [method, setMethod] = useState<SonificationMethod[]>([SonificationMethod.MELODY]);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleChangeMethod = (
    details: SelectValueChangeDetails<{ label: string; value: SonificationMethod }>,
  ) => {
    setMethod(details.value as SonificationMethod[]);
  };

  const handlePlay = useCallback(async () => {
    try {
      setIsPlaying(true);
      const methodType = method[0];
      console.log(`데이터를 ${methodType} 방식으로 변환합니다:`, SAMPLES);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext 상태:', audioContext.state);

      if (audioContext.state === 'suspended') {
        console.log('AudioContext가 suspended 상태입니다. resume()을 호출합니다.');
        await audioContext.resume();
      }

      const result = await sonify([...SAMPLES], methodType);

      console.log('Sonification 결과:', result);
    } catch (error) {
      console.error('Sonification error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [method]);

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
            <Select.Label>변환 방법</Select.Label>
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

        <Button colorScheme="primary" size="lg" onClick={handlePlay} loading={isPlaying}>
          소리로 듣기
        </Button>
      </VStack>
    </Box>
  );
}

export default DemoSection;
