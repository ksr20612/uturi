import { AudioAnalyzer } from '../src/core/analyzers/AudioAnalyzer';

function createMockAudioBuffer(samples: number[]): AudioBuffer {
  return {
    length: samples.length,
    numberOfChannels: 1,
    sampleRate: 44100,
    duration: samples.length / 44100,
    getChannelData: () => new Float32Array(samples),
  } as unknown as AudioBuffer;
}

describe('AudioAnalyzer', () => {
  const analyzer = new AudioAnalyzer();

  it('지정한 numBins 개수의 특성을 추출한다', () => {
    const audio = createMockAudioBuffer(new Array(1024).fill(0.5));
    const features = analyzer.extractFeatures(audio, 16);
    expect(features.length).toBe(16);
  });

  it('무음 오디오는 0에 가까운 특성값을 반환한다', () => {
    const audio = createMockAudioBuffer(new Array(1024).fill(0));
    const features = analyzer.extractFeatures(audio);
    features.forEach((v) => expect(v).toBeCloseTo(0));
  });

  it('진폭이 있는 오디오는 0보다 큰 특성값을 반환한다', () => {
    const audio = createMockAudioBuffer(new Array(1024).fill(0.8));
    const features = analyzer.extractFeatures(audio);
    features.forEach((v) => expect(v).toBeGreaterThan(0));
  });

  it('샘플 수가 bin 수보다 적으면 빈 배열을 반환한다', () => {
    const audio = createMockAudioBuffer([0.5]);
    const features = analyzer.extractFeatures(audio, 32);
    expect(features).toEqual([]);
  });
});
