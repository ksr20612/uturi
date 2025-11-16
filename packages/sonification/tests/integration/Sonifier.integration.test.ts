import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import Sonifier from '../../src/core/Sonifier';
import type { SonifierMethod } from '../../src/typings/sonification';
import { applyAudioPolyfill, restoreAudioPolyfill } from './integration.setup';
import {
  registrar,
  AudioBuffer as AudioBufferMock,
  AudioContext as AudioContextMock,
} from 'standardized-audio-context-mock';

describe('Sonifier Integration Test - Web Audio API Polyfill', () => {
  let sonifier: Sonifier;

  /*
   통합 테스트 전후에 audio context를 폴리필로 대체하고 제거(유닛 테스트의 단순 모킹과 충돌하지 않게 처리하기 위함)
   TODO: 더 명료한 방법 생각해보기
  */
  beforeAll(() => {
    applyAudioPolyfill();
  });
  afterAll(() => {
    restoreAudioPolyfill();
  });

  beforeEach(() => {
    sonifier = new Sonifier();
  });
  afterEach(() => {
    sonifier.cleanup();
  });

  describe('AudioContext 생성 및 초기화', () => {
    it('내부적으로 AudioContext가 polyfill로 생성되어야 한다', async () => {
      const testData = [10, 50, 30, 80, 20];
      const result = await sonifier.sonify(testData, 'frequency');

      expect(result.audioBuffer).toBeDefined();
      expect(result.audioBuffer).toBeInstanceOf(AudioBuffer);

      expect(result.audioBuffer.sampleRate).toBe(44100);
      expect(result.audioBuffer.numberOfChannels).toBe(1);
      expect(result.audioBuffer.length).toBeGreaterThan(0);
    });

    it('AudioContext가 polyfill 타입인지 확인', async () => {
      const testData = [1, 2, 3];
      await sonifier.sonify(testData, 'frequency');

      const audioContext = new AudioContext();
      expect(audioContext).toBeDefined();
      expect(typeof audioContext.createBufferSource).toBe('function');
      expect(audioContext instanceof AudioContext).toBe(true);

      await audioContext.close();
    });
  });

  describe('전체 음성화 흐름 검증', () => {
    const testData = [10, 50, 30, 80, 20, 90, 40, 70];

    it('frequency 메서드로 전체 흐름이 정상 동작해야 한다', async () => {
      const result = await sonifier.sonify(testData, 'frequency');

      expect(result.audioBuffer).toBeDefined();
      expect(result.audioBuffer.length).toBe(44100 * 2);

      expect(result.dataPoints).toBeDefined();
      expect(result.dataPoints.length).toBe(testData.length);

      result.dataPoints.forEach((point, index) => {
        expect(point.value).toBe(testData[index]);
        expect(point.timestamp).toBeGreaterThanOrEqual(0);
        expect(point.frequency).toBeGreaterThan(0);
        expect(point.volume).toBeGreaterThan(0);
        expect(point.volume).toBeLessThanOrEqual(1);
      });

      expect(result.duration).toBe(2.0);
    });

    it('volume 메서드로 전체 흐름이 정상 동작해야 한다', async () => {
      const result = await sonifier.sonify(testData, 'volume');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(testData.length);

      const volumes = result.dataPoints.map((p) => p.volume);
      const uniqueVolumes = new Set(volumes);
      expect(uniqueVolumes.size).toBeGreaterThan(1);
    });

    it('rhythm 메서드로 전체 흐름이 정상 동작해야 한다', async () => {
      const result = await sonifier.sonify(testData, 'rhythm');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(testData.length);

      result.dataPoints.forEach((point, index) => {
        expect(point.timestamp).toBeGreaterThanOrEqual(0);
        if (index > 0) {
          expect(point.timestamp).toBeGreaterThan(result.dataPoints[index - 1].timestamp);
        }
      });
    });

    it('melody 메서드로 전체 흐름이 정상 동작해야 한다', async () => {
      const result = await sonifier.sonify(testData, 'melody');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(testData.length);

      result.dataPoints.forEach((point) => {
        expect(point.note).toBeDefined();
        expect(typeof point.note).toBe('string');
        expect(['C', 'D', 'E', 'F', 'G', 'A', 'B']).toContain(point.note);
      });
    });
  });

  describe('AudioBuffer 데이터 검증', () => {
    it('생성된 AudioBuffer에 실제 오디오 데이터가 포함되어야 한다', async () => {
      const testData = [10, 50, 30];
      const result = await sonifier.sonify(testData, 'frequency');

      const channelData = result.audioBuffer.getChannelData(0);

      expect(channelData.length).toBe(result.audioBuffer.length);

      const hasNonZeroData = channelData.some((sample) => sample !== 0);
      expect(hasNonZeroData).toBe(true);

      channelData.forEach((sample) => {
        expect(sample).toBeGreaterThanOrEqual(-1);
        expect(sample).toBeLessThanOrEqual(1);
      });
    });

    it('다양한 입력 데이터에 대해 올바른 AudioBuffer가 생성되어야 한다', async () => {
      const testCases = [
        [1, 2, 3],
        [100, 200, 300],
        [0.1, 0.5, 0.9],
        [10, 20, 30, 40, 50],
      ];

      for (const testData of testCases) {
        const result = await sonifier.sonify(testData, 'frequency');

        expect(result.audioBuffer.length).toBe(44100 * 2); // 기본 duration 2초
        expect(result.dataPoints.length).toBe(testData.length);

        // 각 데이터 포인트의 value가 원본 데이터와 일치해야 함
        result.dataPoints.forEach((point, index) => {
          expect(point.value).toBe(testData[index]);
        });
      }
    });
  });

  describe('DataPoints 매핑 검증', () => {
    it('frequency 메서드는 값에 따라 주파수가 올바르게 매핑되어야 한다', async () => {
      const testData = [10, 50, 90]; // 최소, 중간, 최대
      const result = await sonifier.sonify(testData, 'frequency');

      const frequencies = result.dataPoints.map((p) => p.frequency);

      expect(frequencies[0]).toBeLessThan(frequencies[2]);

      frequencies.forEach((freq) => {
        expect(freq).toBeGreaterThanOrEqual(150);
        expect(freq).toBeLessThanOrEqual(1500);
      });
    });

    it('volume 메서드는 값에 따라 볼륨이 올바르게 매핑되어야 한다', async () => {
      const testData = [10, 50, 90];
      const result = await sonifier.sonify(testData, 'volume');

      const volumes = result.dataPoints.map((p) => p.volume);

      expect(volumes[0]).toBeLessThan(volumes[2]);

      volumes.forEach((vol) => {
        expect(vol).toBeGreaterThanOrEqual(0.1);
        expect(vol).toBeLessThanOrEqual(0.5);
      });
    });

    it('melody 메서드는 값에 따라 음표가 올바르게 매핑되어야 한다', async () => {
      const testData = [10, 30, 50, 70, 90];
      const result = await sonifier.sonify(testData, 'melody');

      const notes = result.dataPoints.map((p) => p.note!);
      const frequencies = result.dataPoints.map((p) => p.frequency);

      notes.forEach((note) => {
        expect(['C', 'D', 'E', 'F', 'G', 'A', 'B']).toContain(note);
      });

      expect(frequencies[0]).toBeLessThan(frequencies[4]);
    });
  });

  describe('play 메서드 검증', () => {
    let sonifier: Sonifier;
    let audioBufferMock: AudioBufferMock;
    let audioContextMock: AudioContextMock;

    beforeEach(() => {
      sonifier = new Sonifier();
      audioBufferMock = new AudioBufferMock({ length: 10, sampleRate: 44100 });
      audioContextMock = new AudioContextMock();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sonifier as any).audioContext = audioContextMock;
    });

    afterEach(() => {
      registrar.reset(audioContextMock);
      sonifier.cleanup();
    });

    it('play 메서드가 AudioBuffer를 정상적으로 재생할 수 있어야 한다', async () => {
      const playPromise = sonifier.play(audioBufferMock as unknown as AudioBuffer);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const [audioBufferSourceNodeMock] = registrar.getAudioNodes(
        audioContextMock,
        'AudioBufferSourceNode',
      );

      expect(audioBufferSourceNodeMock).toBeDefined();
      expect(audioBufferSourceNodeMock.buffer).toBe(audioBufferMock);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((audioBufferSourceNodeMock.connect as any).called).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((audioBufferSourceNodeMock.start as any).called).toBe(true);

      // onended를 수동으로 호출
      if (
        audioBufferSourceNodeMock.onended &&
        typeof audioBufferSourceNodeMock.onended === 'function'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (audioBufferSourceNodeMock.onended as any)();
      }

      await expect(playPromise).resolves.not.toThrow();
    });

    it('autoPlay 옵션이 활성화되면 자동으로 재생되어야 한다', async () => {
      const testData = [10, 50, 30];
      const sonifyPromise = sonifier.sonify(testData, 'frequency', { autoPlay: true });

      await new Promise((resolve) => setTimeout(resolve, 100));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actualAudioContext = (sonifier as any).audioContext || audioContextMock;

      const audioBufferSourceNodes = registrar.getAudioNodes(
        actualAudioContext,
        'AudioBufferSourceNode',
      );

      expect(audioBufferSourceNodes.length).toBeGreaterThan(0);

      const playNode = audioBufferSourceNodes[audioBufferSourceNodes.length - 1];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((playNode.connect as any).called).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((playNode.start as any).called).toBe(true);

      // onended를 수동으로 호출
      if (playNode.onended && typeof playNode.onended === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (playNode.onended as any)();
      }

      const result = await sonifyPromise;

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(testData.length);
    });
  });

  describe('설정 관리 검증', () => {
    it('사용자 정의 설정이 올바르게 적용되어야 한다', async () => {
      const customConfig = {
        sampleRate: 22050,
        duration: 1.0,
        frequency: 440,
        minFrequency: 200,
        maxFrequency: 1000,
        volume: 0.5,
        minVolume: 0.2,
        maxVolume: 0.8,
      };

      const customSonifier = new Sonifier(customConfig);
      const testData = [10, 50, 90];
      const result = await customSonifier.sonify(testData, 'frequency');

      expect(result.audioBuffer.sampleRate).toBe(customConfig.sampleRate);
      expect(result.audioBuffer.length).toBe(customConfig.sampleRate * customConfig.duration);
      expect(result.duration).toBe(customConfig.duration);

      result.dataPoints.forEach((point) => {
        expect(point.frequency).toBeGreaterThanOrEqual(customConfig.minFrequency);
        expect(point.frequency).toBeLessThanOrEqual(customConfig.maxFrequency);
      });

      customSonifier.cleanup();
    });

    it('getConfig와 setConfig가 정상 동작해야 함', () => {
      const initialConfig = sonifier.getConfig();
      expect(initialConfig.sampleRate).toBe(44100);

      sonifier.setConfig({ sampleRate: 22050, duration: 3.0 });
      const updatedConfig = sonifier.getConfig();

      expect(updatedConfig.sampleRate).toBe(22050);
      expect(updatedConfig.duration).toBe(3.0);
      expect(updatedConfig.frequency).toBe(initialConfig.frequency);
    });
  });

  describe('에러 처리 검증', () => {
    it('빈 배열 입력 시 에러가 발생하지 않아야 한다', async () => {
      const result = await sonifier.sonify([], 'frequency');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(0);
    });

    it('단일 값 배열도 정상 처리되어야 함', async () => {
      const result = await sonifier.sonify([50], 'frequency');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(1);
      expect(result.dataPoints[0].value).toBe(50);
    });

    it('동일한 값들의 배열도 정상 처리되어야 함', async () => {
      const result = await sonifier.sonify([10, 10, 10], 'frequency');

      expect(result.audioBuffer).toBeDefined();
      expect(result.dataPoints.length).toBe(3);
      expect(result.dataPoints[0].frequency).toBe(result.dataPoints[1].frequency);
      expect(result.dataPoints[1].frequency).toBe(result.dataPoints[2].frequency);
    });
  });

  describe('연속 실행 검증', () => {
    it('여러 번 연속으로 sonify를 호출해도 정상 동작해야 한다', async () => {
      const testData = [10, 50, 30];

      const result1 = await sonifier.sonify(testData, 'frequency');
      const result2 = await sonifier.sonify(testData, 'volume');
      const result3 = await sonifier.sonify(testData, 'rhythm');

      expect(result1.audioBuffer).toBeDefined();
      expect(result2.audioBuffer).toBeDefined();
      expect(result3.audioBuffer).toBeDefined();

      expect(result1.dataPoints.length).toBe(testData.length);
      expect(result2.dataPoints.length).toBe(testData.length);
      expect(result3.dataPoints.length).toBe(testData.length);
    });

    it('다양한 메서드를 연속으로 실행해도 정상 동작해야 한다', async () => {
      const testData = [10, 20, 30, 40, 50];
      const methods: SonifierMethod[] = ['frequency', 'volume', 'rhythm', 'melody'];

      for (const method of methods) {
        const result = await sonifier.sonify(testData, method);
        expect(result.audioBuffer).toBeDefined();
        expect(result.dataPoints.length).toBe(testData.length);
      }
    });
  });
});
