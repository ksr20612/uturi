import { vi } from 'vitest';
import Sonifier from '../../src/core/Sonifier';

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

describe('SonificationMethods', () => {
  let engine: Sonifier;
  let testData: number[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);

    testData = [0.2, 0.5, 0.8, 0.3, 0.9];
    engine = new Sonifier();
  });

  describe('sonify 메서드', () => {
    it('melody 메서드로 음성화할 수 있어야 한다', async () => {
      const result = await engine.sonify(testData, 'melody');

      expect(result).toHaveProperty('audioBuffer');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('dataPoints');
      expect(result.duration).toBe(2.0);
      expect(result.dataPoints).toHaveLength(5);

      expect(result.audioBuffer.length).toBe(44100 * 2.0);
      expect(result.audioBuffer.sampleRate).toBe(44100);
      expect(result.audioBuffer.duration).toBeCloseTo(2.0);
      expect(result.audioBuffer.numberOfChannels).toBe(1);

      result.dataPoints.forEach((point, idx) => {
        expect(point).toHaveProperty('value', testData[idx]);
        expect(point).toHaveProperty('timestamp');
        expect(point).toHaveProperty('volume');
        expect(point).toHaveProperty('frequency');
        expect(point).toHaveProperty('note');
      });
    });

    it('frequency 메서드로 음성화할 수 있어야 한다', async () => {
      const result = await engine.sonify(testData, 'frequency');

      expect(result).toHaveProperty('audioBuffer');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('dataPoints');

      expect(result.audioBuffer.length).toBe(44100 * 2.0);
      expect(result.audioBuffer.sampleRate).toBe(44100);
      expect(result.audioBuffer.duration).toBeCloseTo(2.0);
      expect(result.audioBuffer.numberOfChannels).toBe(1);

      result.dataPoints.forEach((point, idx) => {
        expect(point).toHaveProperty('value', testData[idx]);
        expect(point).toHaveProperty('timestamp');
        expect(point).toHaveProperty('volume');
        expect(point).toHaveProperty('frequency');
        expect(point).not.toHaveProperty('note');
      });
    });

    it('volume 메서드로 음성화할 수 있어야 한다', async () => {
      const result = await engine.sonify(testData, 'volume');

      expect(result).toHaveProperty('audioBuffer');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('dataPoints');

      expect(result.audioBuffer.length).toBe(44100 * 2.0);
      expect(result.audioBuffer.sampleRate).toBe(44100);
      expect(result.audioBuffer.duration).toBeCloseTo(2.0);
      expect(result.audioBuffer.numberOfChannels).toBe(1);

      result.dataPoints.forEach((point, idx) => {
        expect(point).toHaveProperty('value', testData[idx]);
        expect(point).toHaveProperty('timestamp');
        expect(point).toHaveProperty('volume');
        expect(point).toHaveProperty('frequency');
        expect(point).not.toHaveProperty('note');
      });
    });

    it('rhythm 메서드로 음성화할 수 있어야 한다', async () => {
      const result = await engine.sonify(testData, 'rhythm');

      expect(result).toHaveProperty('audioBuffer');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('dataPoints');

      expect(result.audioBuffer.length).toBe(44100 * 2.0);
      expect(result.audioBuffer.sampleRate).toBe(44100);
      expect(result.audioBuffer.duration).toBeCloseTo(2.0);
      expect(result.audioBuffer.numberOfChannels).toBe(1);

      result.dataPoints.forEach((point, idx) => {
        expect(point).toHaveProperty('value', testData[idx]);
        expect(point).toHaveProperty('timestamp');
        expect(point).toHaveProperty('volume');
        expect(point).toHaveProperty('frequency');
        expect(point).not.toHaveProperty('note');
      });
    });

    it('빈 데이터로도 음성화할 수 있어야 한다', async () => {
      const emptyData: number[] = [];
      const result = await engine.sonify(emptyData, 'melody');

      expect(result).toHaveProperty('audioBuffer');
      expect(result.dataPoints).toHaveLength(0);
    });

    it('autoPlay 옵션이 true일 때 play가 호출되어야 한다', async () => {
      const playSpy = vi.spyOn(engine, 'play').mockResolvedValue();

      const result = await engine.sonify(testData, 'melody', { autoPlay: true });

      expect(playSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('audioBuffer');

      playSpy.mockRestore();
    });

    it('autoPlay 옵션이 없거나 false일 때 play가 호출되지 않아야 한다', async () => {
      const playSpy = vi.spyOn(engine, 'play').mockResolvedValue();

      const result = await engine.sonify(testData, 'melody', { autoPlay: false });

      expect(playSpy).not.toHaveBeenCalled();
      expect(result).toHaveProperty('audioBuffer');

      await engine.sonify(testData, 'melody');
      expect(playSpy).not.toHaveBeenCalled();

      playSpy.mockRestore();
    });
  });

  describe('에러 처리', () => {
    it('잘못된 메서드에 대해 기본값을 사용해야 한다', async () => {
      const result = await engine.sonify(testData, 'invalid' as any);

      expect(result).toHaveProperty('audioBuffer');
    });

    it('음수 값들을 올바르게 처리해야 한다', async () => {
      const negativeData: number[] = [-0.5, -1, 0, 0.5, 1.5];

      const result = await engine.sonify(negativeData, 'melody');
      expect(result).toHaveProperty('audioBuffer');
      expect(result.dataPoints).toHaveLength(5);
    });
  });
});
