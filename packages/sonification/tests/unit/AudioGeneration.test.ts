import { vi } from 'vitest';
import Sonifier from '../../src/core/Sonifier';
import type { SonifierMethod } from '../../src/typings/sonification';

const mockAudioContext = {
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(),
  destination: {},
  sampleRate: 44100,
};

const mockAudioBuffer = {
  copyToChannel: vi.fn(),
  copyFromChannel: vi.fn(),
  getChannelData: vi.fn(),
  length: 88200, // 44100Hz * 2s
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

describe('AudioGeneration', () => {
  let engine: Sonifier;
  let testData: number[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);

    testData = [0.2, 0.5, 0.8, 0.3, 0.9];
    engine = new Sonifier();
  });

  describe('오디오 생성', () => {
    it('AudioBuffer를 올바르게 생성해야 한다', async () => {
      await engine.sonify(testData, 'melody');

      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(
        1, // 채널 수
        88200, // 샘플 수 (2초 * 44100Hz)
        44100, // 샘플레이트
      );
      expect(mockAudioBuffer.copyToChannel).toHaveBeenCalled();
    });

    it('모든 소리화 메서드가 AudioBuffer를 생성해야 한다', async () => {
      const methods: SonifierMethod[] = ['melody', 'frequency', 'volume', 'rhythm'];

      for (const method of methods) {
        const result = await engine.sonify(testData, method);
        expect(result.audioBuffer).toBe(mockAudioBuffer);
      }
    });
  });

  // describe('play 메서드', () => {
  //   it('오디오를 재생할 수 있어야 한다', async () => {
  //     await engine.play(mockAudioBuffer);

  //     expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
  //     expect(mockBufferSource.connect).toHaveBeenCalledWith(mockAudioContext.destination);
  //     expect(mockBufferSource.start).toHaveBeenCalled();
  //   });
  // });
});
