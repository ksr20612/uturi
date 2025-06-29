import { vi } from 'vitest';
import SonificationEngine from '../../src/core/SonificationEngine';

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

describe('SonificationEngine', () => {
  let engine: SonificationEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);

    engine = new SonificationEngine();
  });

  describe('생성자', () => {
    it('기본 설정으로 엔진을 생성할 수 있어야 한다', () => {
      expect(engine).toBeInstanceOf(SonificationEngine);
    });

    it('사용자 정의 설정으로 엔진을 생성할 수 있어야 한다', () => {
      const customEngine = new SonificationEngine({
        sampleRate: 22050,
        duration: 3.0,
        frequency: 440,
        volume: 0.5,
      });

      expect(customEngine).toBeInstanceOf(SonificationEngine);
    });
  });

  describe('getConfig 메서드', () => {
    it('기본 설정을 반환해야 한다', () => {
      const config = engine.getConfig();

      expect(config).toBeDefined();
      expect(config.sampleRate).toBe(44100);
      expect(config.duration).toBe(2.0);
      expect(config.frequency).toBe(825);
      expect(config.volume).toBe(0.3);
    });

    it('사용자 정의 설정을 반환해야 한다', () => {
      const customConfig = {
        sampleRate: 22050,
        duration: 3.0,
        frequency: 440,
        volume: 0.8,
      };

      const customEngine = new SonificationEngine(customConfig);
      const config = customEngine.getConfig();

      expect(config.sampleRate).toBe(customConfig.sampleRate);
      expect(config.duration).toBe(customConfig.duration);
      expect(config.frequency).toBe(customConfig.frequency);
      expect(config.volume).toBe(customConfig.volume);
    });

    it('설정 객체의 복사본을 반환해야 한다', () => {
      const config1 = engine.getConfig();
      const config2 = engine.getConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });

    it('부분 설정과 기본 설정이 병합된 결과를 반환해야 한다', () => {
      const partialConfig = {
        duration: 5.0,
        volume: 0.7,
      };

      const customEngine = new SonificationEngine(partialConfig);
      const config = customEngine.getConfig();

      expect(config.duration).toBe(5.0);
      expect(config.volume).toBe(0.7);

      expect(config.sampleRate).toBe(44100);
      expect(config.frequency).toBe(825);
    });
  });
});
