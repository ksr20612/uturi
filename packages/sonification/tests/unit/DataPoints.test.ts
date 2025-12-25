import { vi } from 'vitest';
import Sonifier from '../../src/core/Sonifier';
import type { SonifierMethod } from '../../src/typings/sonifier';

const mockAudioContext = {
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(),
  destination: {},
  sampleRate: 44100,
};

const mockChannelData = new Float32Array(88200);
const mockAudioBuffer = {
  copyToChannel: vi.fn(),
  copyFromChannel: vi.fn(),
  getChannelData: vi.fn(() => mockChannelData),
  length: 88200,
  duration: 2.0,
  numberOfChannels: 1,
  sampleRate: 44100,
} as unknown as AudioBuffer;

const mockBufferSource = {
  buffer: null,
  connect: vi.fn(),
  start: vi.fn(),
};

Object.defineProperty(window, 'AudioContext', {
  value: vi.fn(() => mockAudioContext),
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: vi.fn(() => mockAudioContext),
  writable: true,
});

describe('DataPoints', () => {
  let engine: Sonifier;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);

    engine = new Sonifier();
  });

  describe('데이터 포인트 생성', () => {
    it('데이터 포인트가 올바른 구조로 생성되어야 한다', async () => {
      const testValues = [0.1, 0.5, 0.9];
      const result = await engine.sonify(testValues, 'melody');

      expect(result.dataPoints).toHaveLength(3);

      result.dataPoints.forEach((point, index) => {
        expect(point).toHaveProperty('value', testValues[index]);
        expect(point).toHaveProperty('timestamp');
        expect(point).toHaveProperty('volume');
        expect(point).toHaveProperty('frequency');
        expect(point).toHaveProperty('note');

        const expectedTimestamp = index * (2.0 / 3);
        expect(point.timestamp).toBe(expectedTimestamp);

        expect(point.volume).toBeGreaterThanOrEqual(0.1);
        expect(point.volume).toBeLessThanOrEqual(0.5);
        expect(point.frequency).toBeGreaterThanOrEqual(150);
        expect(point.frequency).toBeLessThanOrEqual(1500);
      });
    });

    it('melody 메서드에서만 note 필드가 포함되어야 한다', async () => {
      const testValues = [0.1, 0.5, 0.9];

      const melodyResult = await engine.sonify(testValues, 'melody');
      melodyResult.dataPoints.forEach((point) => {
        expect(point).toHaveProperty('note');
        expect(typeof point.note).toBe('string');
      });

      const otherMethods: SonifierMethod[] = ['frequency', 'volume', 'rhythm'];
      for (const method of otherMethods) {
        const result = await engine.sonify(testValues, method);
        result.dataPoints.forEach((point) => {
          expect(point).not.toHaveProperty('note');
        });
      }
    });

    it('빈 데이터에 대해 빈 데이터 포인트 배열을 반환해야 한다', async () => {
      const emptyData: number[] = [];
      const result = await engine.sonify(emptyData, 'melody');

      expect(result.dataPoints).toHaveLength(0);
      expect(Array.isArray(result.dataPoints)).toBe(true);
    });

    it('데이터 포인트의 값들이 올바르게 매핑되어야 한다', async () => {
      const testValues = [0, 0.5, 1];
      const result = await engine.sonify(testValues, 'melody');

      expect(result.dataPoints[0].value).toBe(0);
      expect(result.dataPoints[0].volume).toBe(0.1);
      expect(result.dataPoints[0].frequency).toBe(150);
      expect(result.dataPoints[0].note).toBe('C');

      expect(result.dataPoints[1].value).toBe(0.5);
      expect(result.dataPoints[1].volume).toBeCloseTo(0.3, 10);
      expect(result.dataPoints[1].frequency).toBe(825);
      expect(result.dataPoints[1].note).toBe('F');

      expect(result.dataPoints[2].value).toBe(1);
      expect(result.dataPoints[2].volume).toBe(0.5);
      expect(result.dataPoints[2].frequency).toBe(1500);
      expect(result.dataPoints[2].note).toBe('B');
    });
  });
});
