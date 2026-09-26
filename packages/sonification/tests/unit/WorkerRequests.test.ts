import { vi } from 'vitest';
import Sonifier from '../../src/core/Sonifier';
import { SonificationError, ERROR_CODES } from '../../src/core/errors';
import type { DataPoint } from '../../src/typings/sonifier';

interface WorkerRequestMessage {
  type: string;
  requestId: number;
  payload: {
    data: number[];
    method: string;
  };
}

interface WorkerResponseMessage {
  type: 'AUDIO_GENERATED' | 'ERROR';
  requestId: number;
  payload: {
    audioData?: Float32Array;
    dataPoints?: DataPoint[];
    sampleRate?: number;
    error?: {
      message: string;
      name: string;
    };
  };
}

const { audioWorkerMock } = vi.hoisted(() => {
  class MockAudioWorker {
    static instances: MockAudioWorker[] = [];

    listeners = new Set<(event: MessageEvent<WorkerResponseMessage>) => void>();
    messages: WorkerRequestMessage[] = [];
    terminated = false;

    constructor() {
      MockAudioWorker.instances.push(this);
    }

    addEventListener(
      type: string,
      handler: (event: MessageEvent<WorkerResponseMessage>) => void,
    ): void {
      if (type === 'message') this.listeners.add(handler);
    }

    removeEventListener(
      type: string,
      handler: (event: MessageEvent<WorkerResponseMessage>) => void,
    ): void {
      if (type === 'message') this.listeners.delete(handler);
    }

    postMessage(message: WorkerRequestMessage): void {
      this.messages.push(message);
    }

    terminate(): void {
      this.terminated = true;
    }

    emit(data: WorkerResponseMessage): void {
      for (const handler of [...this.listeners]) {
        handler({ data } as MessageEvent<WorkerResponseMessage>);
      }
    }
  }

  return {
    audioWorkerMock: {
      instances: MockAudioWorker.instances,
      create: () => new MockAudioWorker(),
    },
  };
});

vi.mock('../../src/core/createAudioWorker', () => ({
  default: () => audioWorkerMock.create(),
}));

const mockAudioContext = {
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(),
  destination: {},
  sampleRate: 44100,
  close: vi.fn(),
  state: 'running',
  resume: vi.fn(),
};

const mockChannelData = new Float32Array(88200);
const mockAudioBuffer = {
  getChannelData: vi.fn(() => mockChannelData),
  length: 88200,
  duration: 2.0,
  numberOfChannels: 1,
  sampleRate: 44100,
} as unknown as AudioBuffer;

function dataPoints(values: number[]): DataPoint[] {
  return values.map((value, index) => ({
    value,
    timestamp: index,
    volume: 0.3,
    frequency: 440,
  }));
}

describe('WorkerRequests', () => {
  let engine: Sonifier;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    audioWorkerMock.instances.length = 0;

    if (typeof globalThis.Worker === 'undefined') {
      vi.stubGlobal('Worker', class Worker {});
    }

    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    Object.defineProperty(window, 'AudioContext', {
      value: vi.fn(() => mockAudioContext),
      writable: true,
    });

    engine = new Sonifier();
  });

  afterEach(() => {
    engine.cleanup();
    vi.useRealTimers();
  });

  function worker() {
    const instance = audioWorkerMock.instances[0];
    if (!instance) {
      throw new Error('Audio worker was not created');
    }
    return instance;
  }

  function respond(requestId: number, values: number[]): void {
    worker().emit({
      type: 'AUDIO_GENERATED',
      requestId,
      payload: {
        audioData: new Float32Array(values.length),
        dataPoints: dataPoints(values),
        sampleRate: 44100,
      },
    });
  }

  it('각 워커 응답을 요청과 맞춰야 한다', async () => {
    const first = engine.sonify([1, 2], 'melody');
    const second = engine.sonify([1, 2, 3, 4], 'frequency');
    const [firstMessage, secondMessage] = worker().messages;

    respond(secondMessage.requestId, [1, 2, 3, 4]);
    respond(firstMessage.requestId, [1, 2]);

    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(firstResult.dataPoints.map((point) => point.value)).toEqual([1, 2]);
    expect(secondResult.dataPoints.map((point) => point.value)).toEqual([1, 2, 3, 4]);
  });

  it('타임아웃된 요청의 늦은 응답은 다음 요청에 쓰이지 않아야 한다', async () => {
    vi.useFakeTimers();

    const pending = engine.sonify([1], 'melody');
    const staleId = worker().messages[0].requestId;
    const timedOut = expect(pending).rejects.toMatchObject({ code: ERROR_CODES.TIMEOUT_ERROR });

    await vi.advanceTimersByTimeAsync(10_000);
    await timedOut;

    const next = engine.sonify([1, 2], 'melody');
    const nextId = worker().messages[1].requestId;

    respond(staleId, [9]);
    respond(nextId, [1, 2]);

    await expect(next).resolves.toMatchObject({
      dataPoints: dataPoints([1, 2]),
    });
  });

  it('cleanup은 진행 중인 워커 생성을 거절해야 한다', async () => {
    const pending = engine.sonify([1, 2, 3], 'melody');

    expect(worker().messages).toHaveLength(1);
    engine.cleanup();

    await expect(pending).rejects.toBeInstanceOf(SonificationError);
    await expect(pending).rejects.toMatchObject({ code: ERROR_CODES.CANCELLED });
    expect(worker().terminated).toBe(true);
  });
});
