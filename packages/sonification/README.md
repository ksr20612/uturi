# @uturi/sonification

시각 장애인을 위한 접근성 도구로, 수치 데이터를 음악적 멜로디로 변환하여 데이터를 청각적으로 경험할 수 있게 해주는 라이브러리입니다.

## 🎵 주요 기능

- **4가지 소리화 방법**: frequency, volume, rhythm, melody
- **유연한 설정**: 주파수, 볼륨, 리듬 등 다양한 파라미터 조정 가능
- **TypeScript 지원**: 완전한 타입 안전성 제공
- **접근성 중심**: 시각 장애인을 위한 데이터 시각화 대안

## 📦 설치

```bash
npm install @uturi/sonification
# 또는
yarn add @uturi/sonification
# 또는
pnpm add @uturi/sonification
```

## 🚀 빠른 시작

### 기본 사용법

```typescript
import { sonify, SonificationEngine } from '@uturi/sonification';

// 간단한 사용법
const data = [10, 50, 30, 80, 20, 90, 40, 70];
const result = await sonify(data, 'frequency');

// AudioBuffer를 사용하여 오디오 재생
const audioContext = new AudioContext();
const source = audioContext.createBufferSource();
source.buffer = result.audioBuffer;
source.connect(audioContext.destination);
source.start();
```

### SonificationEngine 사용법

```typescript
import { SonificationEngine } from '@uturi/sonification';

const engine = new SonificationEngine({
  sampleRate: 44100,
  duration: 3.0,
  frequency: 440,
  volume: 0.5,
});

const result = await engine.sonify([1, 2, 3, 4, 5], 'melody', {
  autoPlay: true,
});

console.log('생성된 데이터 포인트:', result.dataPoints);
console.log('오디오 길이:', result.duration);
```

## 🎛️ 소리화 방법

### 1. Frequency (주파수)

값에 따라 주파수가 변화합니다.

```typescript
const result = await sonify(data, 'frequency');
```

### 2. Volume (볼륨)

값에 따라 볼륨이 변화합니다.

```typescript
const result = await sonify(data, 'volume');
```

### 3. Rhythm (리듬)

값에 따라 리듬 패턴이 변화합니다.

```typescript
const result = await sonify(data, 'rhythm');
```

### 4. Melody (멜로디)

값에 따라 음계가 변화하여 멜로디를 만듭니다.

```typescript
const result = await sonify(data, 'melody');
```

## ⚙️ 설정 옵션

### SonificationConfig

```typescript
interface SonificationConfig {
  // 기본 오디오 설정
  sampleRate?: number; // 샘플레이트 (기본값: 44100)
  duration?: number; // 오디오 길이 (기본값: 2.0초)

  // 주파수 설정
  frequency?: number; // 기본 주파수 (기본값: 825Hz)
  minFrequency?: number; // 최소 주파수 (기본값: 150Hz)
  maxFrequency?: number; // 최대 주파수 (기본값: 1500Hz)

  // 볼륨 설정
  volume?: number; // 기본 볼륨 (범위: 0 ~ 1, 기본값: 0.3)
  minVolume?: number; // 최소 볼륨 (기본값: 0.1)
  maxVolume?: number; // 최대 볼륨 (기본값: 0.5)

  // 리듬 설정
  rhythm?: number; // 기본 리듬 (범위: 0 ~ 1, 기본값: 0.5)
  minRhythm?: number; // 최소 리듬 (기본값: 0.1)
  maxRhythm?: number; // 최대 리듬 (기본값: 1)
}
```

### SonificationOptions

```typescript
interface SonificationOptions {
  autoPlay?: boolean; // 자동 재생 여부
}
```

## 📊 반환 데이터

### SonificationResult

```typescript
interface SonificationResult {
  audioBuffer: AudioBuffer; // 생성된 오디오 버퍼
  duration: number; // 오디오 길이 (초)
  dataPoints: DataPoint[]; // 데이터 포인트 배열
}
```

### DataPoint

```typescript
interface DataPoint {
  value: number; // 원본 값
  timestamp: number; // 시간 위치 (초)
  volume: number; // 볼륨 값
  frequency: number; // 주파수 값
  note?: string; // 음계 이름 (melody 방식에서만)
}
```

## 🎯 사용 예시

### 차트 데이터 소리화

```typescript
import { sonify } from '@uturi/sonification';

// 차트 데이터
const chartData = [25, 50, 75, 30, 90, 45, 60];

// 멜로디로 소리화
const melodyResult = await sonify(chartData, 'melody');

// 주파수로 소리화
const frequencyResult = await sonify(chartData, 'frequency');

// 볼륨으로 소리화
const volumeResult = await sonify(chartData, 'volume');

// 리듬으로 소리화
const rhythmResult = await sonify(chartData, 'rhythm');
```

### 커스텀 설정으로 소리화

```typescript
import { SonificationEngine } from '@uturi/sonification';

const engine = new SonificationEngine({
  sampleRate: 48000,
  duration: 5.0,
  frequency: 220, // A3 음
  minFrequency: 110, // A2 음
  maxFrequency: 880, // A5 음
  volume: 0.4,
  minVolume: 0.05,
  maxVolume: 0.8,
});

const result = await engine.sonify([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 'melody', {
  autoPlay: true,
});
```

### HTML Audio 요소와 함께 사용

```typescript
import { sonify } from '@uturi/sonification';

async function createAudioElement(data: number[]) {
  const result = await sonify(data, 'frequency');

  // AudioBuffer를 Blob으로 변환
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();
  source.buffer = result.audioBuffer;

  // MediaStream으로 변환
  const dest = audioContext.createMediaStreamDestination();
  source.connect(dest);

  // HTML audio 요소에 연결
  const audio = document.createElement('audio');
  audio.srcObject = dest.stream;
  audio.controls = true;

  document.body.appendChild(audio);

  return audio;
}
```

## 🧪 테스트

### 단위 테스트 실행

```bash
pnpm test
```

### E2E 테스트 실행

```bash
# 테스트 서버 시작
pnpm dev:test

# 다른 터미널에서 E2E 테스트 실행
pnpm test:e2e
```

### 테스트 감시 모드

```bash
pnpm test:watch
```

## 🛠️ 개발

### 빌드

```bash
pnpm build
```

### 개발 모드 (감시)

```bash
pnpm dev
```

### 린트 검사

```bash
pnpm lint
```

### 타입 검사

```bash
pnpm type-check
```

## 📋 요구사항

- **Node.js**: 18.0.0 이상
- **브라우저**: Web Audio API 지원 브라우저
- **TypeScript**: 5.0.0 이상 (개발 시)

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🎵 접근성

이 라이브러리는 시각 장애인을 위한 데이터 접근성을 향상시키기 위해 개발되었습니다. 데이터 시각화의 대안으로 청각적 표현을 제공하여, 모든 사용자가 데이터를 효과적으로 이해할 수 있도록 돕습니다.
