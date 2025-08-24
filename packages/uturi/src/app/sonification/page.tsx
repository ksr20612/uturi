/* eslint-disable no-console */
'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';

import { Chart, useChart } from '@chakra-ui/charts';
import { Box, Button, Code, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { sonify as sonifyArray } from '@uturi/sonification';

import { CartesianGrid, Line, LineChart, Tooltip, YAxis } from 'recharts';

import SAMPLES from '@/app/sonification/_constants/Samples';

import { SonificationMethod } from './_constants/SonificationOptions';

export default function SonificationPage() {
  const [method, setMethod] = useState<SonificationMethod>(SonificationMethod.MELODY);
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

  const handleChangeMethod = (e: ChangeEvent<HTMLSelectElement>) =>
    setMethod(e.target.value as SonificationMethod);

  const handlePlay = useCallback(async () => {
    try {
      setIsPlaying(true);
      console.log(`데이터를 ${method} 방식으로 변환합니다:`, SAMPLES);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext 상태:', audioContext.state);

      if (audioContext.state === 'suspended') {
        console.log('AudioContext가 suspended 상태입니다. resume()을 호출합니다.');
        await audioContext.resume();
      }

      const result = await sonifyArray([...SAMPLES], method);

      console.log('Sonification 결과:', result);
    } catch (error) {
      console.error('Sonification error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [method]);

  return (
    <Box as="main" py={8} bg="gray.50" minH="100vh">
      <Container maxW="4xl">
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              @uturi/sonification
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto" wordBreak="keep-all">
              데이터를 시각화한 차트, 비시각 사용자들에게는 동일한 경험을 전달할 수 없습니다.
              <br />
              이제{' '}
              <Text as="strong" color="teal.solid">
                소리
              </Text>
              를 통해 데이터의 변화량을 빠르고 쉽게 전달해보세요.
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <VStack gap={4} align="stretch">
              <Text fontWeight="bold" mb={2}>
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
                <Text fontWeight="semibold" mb={2}>
                  변환 방법
                </Text>
                <select
                  value={method}
                  onChange={handleChangeMethod}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '16px',
                  }}
                >
                  <option value={SonificationMethod.MELODY}>음계 변화</option>
                  <option value={SonificationMethod.VOLUME}>음량 변화</option>
                  <option value={SonificationMethod.RHYTHM}>리듬 변화</option>
                </select>
              </Box>

              <Button colorScheme="primary" size="lg" onClick={handlePlay} loading={isPlaying}>
                소리로 듣기
              </Button>
            </VStack>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4}>
              설치
            </Heading>
            <Code p={3} borderRadius="md" bg="gray.100" fontSize="sm" display="block" w="full">
              npm install @uturi/sonification
            </Code>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4}>
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
        </VStack>
      </Container>
    </Box>
  );
}
