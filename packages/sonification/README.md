# @uturi/sonification

A data sonification library that transforms numerical data into musical melodies, enabling visually impaired users to experience data audibly. Inspired by synesthesia—a condition where people experience colors when hearing music—and synesthetic imagery in literature, this library bridges the gap between visual and auditory perception.

## Features

- **4 Sonification Methods**: frequency, volume, rhythm, melody
- **Framework Support**: Works with React, Vue, Svelte, or vanilla JavaScript
- **Flexible Configuration**: Adjust parameters such as frequency, volume, rhythm, and more
- **TypeScript Support**: Full type safety
- **Web Worker Support**: Audio generation in background thread for better performance
- **Comprehensive Error Handling**: Custom error classes with error codes for better error management
- **Accessibility Focused**: An alternative to data visualization for the visually impaired

## Demo

open https://uturi.vercel.app/sonification

## Installation

```bash
npm install @uturi/sonification
# or
yarn add @uturi/sonification
# or
pnpm add @uturi/sonification
```

## Quick Start

### Vanilla JavaScript / TypeScript

```typescript
import { Sonifier } from '@uturi/sonification';

const data = [10, 50, 30, 80, 20, 90, 40, 70];
const sonifier = new Sonifier();

const result = await sonifier.sonify(data, 'frequency', { autoPlay: true });

console.log('Generated data points:', result.dataPoints);
console.log('Audio duration:', result.duration);
```

### React

```tsx
import { useSonifier } from '@uturi/sonification/react';
import { useCallback } from 'react';

function ChartWithSound() {
  const chartData = [10, 25, 15, 40, 35, 60];
  const { sonify, isPlaying, error, result } = useSonifier({
    duration: 2.0,
    volume: 0.5,
  });

  const handlePlaySound = useCallback(async () => {
    try {
      await sonify(chartData, 'melody', { autoPlay: true });
    } catch (err) {
      // err is always SonificationError
      console.error('Error:', err);
    }
  }, [chartData, sonify]);

  return (
    <div>
      <button onClick={handlePlaySound} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Chart Sound'}
      </button>
      {error && (
        <div>
          Error: {error.message}
          {error.code && ` (${error.code})`}
        </div>
      )}
      {result && <div>Last result: {result.dataPoints.length} data points</div>}
    </div>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { useSonifier } from '@uturi/sonification/vue';

const chartData = [10, 25, 15, 40, 35, 60];
const { sonify, isPlaying, error, result } = useSonifier({
  duration: 2.0,
  volume: 0.5,
});

const handlePlaySound = async () => {
  try {
    await sonify(chartData, 'melody', { autoPlay: true });
  } catch (err) {
    // err is always SonificationError
    console.error('Error:', err);
  }
};
</script>

<template>
  <div>
    <button @click="handlePlaySound" :disabled="isPlaying">
      {{ isPlaying ? 'Playing...' : 'Play Chart Sound' }}
    </button>
    <div v-if="error">
      Error: {{ error.message }}
      <span v-if="error.code"> ({{ error.code }})</span>
    </div>
    <div v-if="result">Last result: {{ result.dataPoints.length }} data points</div>
  </div>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { useSonifier } from '@uturi/sonification/svelte';

  const chartData = [10, 25, 15, 40, 35, 60];
  const { sonify, isPlaying, error, result } = useSonifier({
    duration: 2.0,
    volume: 0.5,
  });

  const handlePlaySound = async () => {
    try {
      await sonify(chartData, 'melody', { autoPlay: true });
    } catch (err) {
      // err is always SonificationError
      console.error('Error:', err);
    }
  };
</script>

<button on:click={handlePlaySound} disabled={$isPlaying}>
  {$isPlaying ? 'Playing...' : 'Play Chart Sound'}
</button>
{#if $error}
  <div>
    Error: {$error.message}
    {#if $error.code} ({$error.code}){/if}
  </div>
{/if}
{#if $result}
  <div>Last result: {$result.dataPoints.length} data points</div>
{/if}
```

## Sonification Methods

### 1. Frequency

The frequency (pitch) changes according to the value. Higher values produce higher pitches.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'frequency', { autoPlay: true });
```

### 2. Volume

The volume changes according to the value. Higher values produce louder sounds.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'volume', { autoPlay: true });
```

### 3. Rhythm

The rhythm pattern changes according to the value. Higher values produce faster rhythms.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'rhythm', { autoPlay: true });
```

### 4. Melody

The scale changes according to the value, creating a musical melody using notes (C, D, E, F, G, A, B).

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'melody', { autoPlay: true });
```

## Configuration

### SonifierConfig

```typescript
interface SonifierConfig {
  // Basic audio settings
  sampleRate?: number; // Sample rate (default: 44100)
  duration?: number; // Audio duration in seconds (default: 2.0)

  // Frequency settings
  frequency?: number; // Base frequency in Hz (default: 825)
  minFrequency?: number; // Minimum frequency in Hz (default: 150)
  maxFrequency?: number; // Maximum frequency in Hz (default: 1500)

  // Volume settings
  volume?: number; // Base volume (range: 0 ~ 1, default: 0.3)
  minVolume?: number; // Minimum volume (default: 0.1)
  maxVolume?: number; // Maximum volume (default: 0.5)

  // Rhythm settings
  rhythm?: number; // Base rhythm (range: 0 ~ 1, default: 0.5)
  minRhythm?: number; // Minimum rhythm (default: 0.1)
  maxRhythm?: number; // Maximum rhythm (default: 1)
}
```

### SonifierOptions

```typescript
interface SonifierOptions {
  autoPlay?: boolean; // Whether to play audio automatically (default: false)
}
```

### Example: Custom Configuration

```typescript
import { Sonifier } from '@uturi/sonification';

const sonifier = new Sonifier({
  // Basic audio settings
  duration: 3.0, // 3 seconds playback
  sampleRate: 44100, // CD quality

  // Frequency range (Hz)
  minFrequency: 200, // Lowest pitch
  maxFrequency: 800, // Highest pitch

  // Volume range (0-1)
  minVolume: 0.1, // Minimum volume
  maxVolume: 0.8, // Maximum volume

  // Rhythm range (0-1)
  minRhythm: 0.2, // Minimum rhythm
  maxRhythm: 0.9, // Maximum rhythm
});

// Configuration can also be updated dynamically
sonifier.setConfig({
  duration: 4.0,
  volume: 0.6,
});

const result = await sonifier.sonify(salesData, 'frequency', { autoPlay: true });
```

## API Reference

### Core API

#### `Sonifier`

The main class for creating sonification instances.

```typescript
class Sonifier {
  constructor(config?: SonifierConfig);

  sonify(
    data: number[],
    method: SonifierMethod,
    options?: SonifierOptions,
  ): Promise<SonifierResult>;

  play(audioBuffer: AudioBuffer): Promise<void>;
  getConfig(): Required<SonifierConfig>;
  setConfig(config: SonifierConfig): void;
  cleanup(): void;
}
```

#### `sonify(data, method, options?)`

Converts numeric data into audio.

**Parameters:**

- `data: number[]` - Array of numeric values to sonify
- `method: SonifierMethod` - Sonification method: `'frequency' | 'volume' | 'rhythm' | 'melody'`
- `options?: SonifierOptions` - Optional configuration

**Returns:** `Promise<SonifierResult>`

**Example:**

```typescript
const result = await sonifier.sonify([10, 20, 30, 40, 50], 'melody', {
  autoPlay: true,
});
```

#### `play(audioBuffer)`

Plays an AudioBuffer through the Sonifier instance.

**Parameters:**

- `audioBuffer: AudioBuffer` - Web Audio API AudioBuffer to play

**Returns:** `Promise<void>`

**Example:**

```typescript
const result = await sonifier.sonify(data, 'frequency');
await sonifier.play(result.audioBuffer);
```

### Framework Hooks

#### React: `useSonifier(initialConfig?)`

```typescript
import { useSonifier } from '@uturi/sonification/react';

const {
  sonify, // (data, method, options?) => Promise<SonifierResult>
  play, // (audioBuffer) => Promise<void>
  getConfig, // () => Required<SonifierConfig>
  setConfig, // (config) => void
  isPlaying, // boolean
  error, // SonificationError | null
  result, // SonifierResult | null
  getSonifier, // () => Sonifier
} = useSonifier(initialConfig);
```

#### Vue: `useSonifier(initialConfig?)`

```typescript
import { useSonifier } from '@uturi/sonification/vue';

const {
  sonify, // (data, method, options?) => Promise<SonifierResult>
  play, // (audioBuffer) => Promise<void>
  getConfig, // () => Required<SonifierConfig>
  setConfig, // (config) => void
  isPlaying, // Ref<boolean>
  error, // Ref<SonificationError | null>
  result, // Ref<SonifierResult | null>
  getSonifier, // () => Sonifier
} = useSonifier(initialConfig);
```

#### Svelte: `useSonifier(initialConfig?)`

```typescript
import { useSonifier } from '@uturi/sonification/svelte';

const {
  sonify, // (data, method, options?) => Promise<SonifierResult>
  play, // (audioBuffer) => Promise<void>
  getConfig, // () => Required<SonifierConfig>
  setConfig, // (config) => void
  isPlaying, // Writable<boolean>
  error, // Writable<SonificationError | null>
  result, // Writable<SonifierResult | null>
  getSonifier, // () => Sonifier
} = useSonifier(initialConfig);
```

### Return Types

#### `SonifierResult`

```typescript
interface SonifierResult {
  audioBuffer: AudioBuffer; // Generated audio buffer
  duration: number; // Audio duration in seconds
  dataPoints: DataPoint[]; // Array of data points
}
```

#### `DataPoint`

```typescript
interface DataPoint {
  value: number; // Original value
  timestamp: number; // Time position in seconds
  volume: number; // Volume value
  frequency: number; // Frequency value in Hz
  note?: string; // Note name (only for melody method: 'C', 'D', 'E', 'F', 'G', 'A', 'B')
}
```

#### `SonificationError`

```typescript
class SonificationError extends Error {
  readonly code: SonificationErrorCode; // Error code to distinguish error types
  readonly cause?: Error; // Original error that caused this error
  readonly field?: string; // Field name where error occurred (for validation errors)
}
```

#### `ERROR_CODES`

```typescript
export const ERROR_CODES = {
  WORKER_ERROR: 'WORKER_ERROR', // Web Worker initialization or execution error
  VALIDATION_ERROR: 'VALIDATION_ERROR', // Input data or configuration validation failed
  TIMEOUT_ERROR: 'TIMEOUT_ERROR', // Audio generation timeout
  AUDIO_CONTEXT_ERROR: 'AUDIO_CONTEXT_ERROR', // AudioContext related error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR', // Unknown error
} as const;

export type SonificationErrorCode =
  | typeof ERROR_CODES.WORKER_ERROR
  | typeof ERROR_CODES.VALIDATION_ERROR
  | typeof ERROR_CODES.TIMEOUT_ERROR
  | typeof ERROR_CODES.AUDIO_CONTEXT_ERROR
  | typeof ERROR_CODES.UNKNOWN_ERROR;
```

## Requirements

- **Node.js**: 18.0.0 or higher
- **Browser**: Web Audio API supported browsers (Chrome, Firefox, Safari, Edge)

### Peer Dependencies

The following are optional peer dependencies. Install only the ones you need:

- `react`: ^18.0.0 (for React support)
- `vue`: ^3.0.0 (for Vue support)
- `svelte`: ^3.0.0 || ^4.0.0 || ^5.0.0 (for Svelte support)

## Advanced Usage

### Using Core API Only

If you only need the core functionality without framework hooks:

```typescript
import { Sonifier } from '@uturi/sonification/core';

const sonifier = new Sonifier();
// ... same API as above
```

### Manual Audio Playback

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'melody', { autoPlay: false });

// Play later
await sonifier.play(result.audioBuffer);

// Or use the AudioBuffer with other Web Audio API features
const audioContext = new AudioContext();
const source = audioContext.createBufferSource();
source.buffer = result.audioBuffer;
source.connect(audioContext.destination);
source.start();
```

### Error Handling

All errors thrown by the library are instances of `SonificationError`, which provides structured error information including error codes, field names, and cause errors.

#### Error Types

The library uses error codes to distinguish different types of errors:

```typescript
import { SonificationError, ERROR_CODES } from '@uturi/sonification';

try {
  const result = await sonifier.sonify(data, 'melody', { autoPlay: true });
  console.log('Success:', result);
} catch (error) {
  if (error instanceof SonificationError) {
    switch (error.code) {
      case ERROR_CODES.VALIDATION_ERROR:
        console.error('Validation error:', error.message);
        console.error('Field:', error.field); // Field name where error occurred
        break;
      case ERROR_CODES.WORKER_ERROR:
        console.error('Worker error:', error.message);
        if (error.cause) {
          console.error('Cause:', error.cause);
        }
        break;
      case ERROR_CODES.TIMEOUT_ERROR:
        console.error('Timeout error:', error.message);
        break;
      case ERROR_CODES.AUDIO_CONTEXT_ERROR:
        console.error('AudioContext error:', error.message);
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

#### Error Codes

```typescript
export const ERROR_CODES = {
  WORKER_ERROR: 'WORKER_ERROR', // Web Worker initialization or execution error
  VALIDATION_ERROR: 'VALIDATION_ERROR', // Input data or configuration validation failed
  TIMEOUT_ERROR: 'TIMEOUT_ERROR', // Audio generation timeout
  AUDIO_CONTEXT_ERROR: 'AUDIO_CONTEXT_ERROR', // AudioContext related error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR', // Unknown error
} as const;
```

#### SonificationError Class

```typescript
class SonificationError extends Error {
  readonly code: SonificationErrorCode; // Error code
  readonly cause?: Error; // Original error (if any)
  readonly field?: string; // Field name (for validation errors)
}
```

#### Example: Handling Validation Errors

```typescript
import { Sonifier, SonificationError, ERROR_CODES } from '@uturi/sonification';

const sonifier = new Sonifier();

try {
  // Invalid configuration
  sonifier.setConfig({
    minFrequency: 1000,
    maxFrequency: 500, // Invalid: min > max
  });
} catch (error) {
  if (error instanceof SonificationError && error.code === ERROR_CODES.VALIDATION_ERROR) {
    console.error('Validation failed:', error.message);
    console.error('Problem field:', error.field); // 'frequency'
  }
}

try {
  // Invalid data
  await sonifier.sonify([NaN, Infinity, null as any], 'frequency');
} catch (error) {
  if (error instanceof SonificationError && error.code === ERROR_CODES.VALIDATION_ERROR) {
    console.error('Invalid data:', error.message);
    console.error('Field:', error.field); // 'data'
  }
}
```

#### Example: Framework Integration

```typescript
// React
import { useSonifier } from '@uturi/sonification/react';
import { SonificationError, ERROR_CODES } from '@uturi/sonification';

function MyComponent() {
  const { sonify, error } = useSonifier();

  // error is always SonificationError | null
  if (error) {
    if (error.code === ERROR_CODES.VALIDATION_ERROR) {
      return <div>Validation error: {error.message}</div>;
    }
    return <div>Error: {error.message}</div>;
  }

  // ...
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repo and git clone it
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run watch mode (it will watch code changes in `src/` folder and generate files in `dist/` folder):
   ```bash
   cd packages/sonification
   pnpm run dev
   ```
4. Add/update code in `src/` folder
5. Test your changes:
   ```bash
   # Run tests
   pnpm run test
   ```
6. Lint and type check:
   ```bash
   pnpm run lint
   pnpm run type-check
   ```
7. Push to your forked repo on GitHub
8. Make a pull request to the main branch of this repo

## Related Links

- [GitHub Repository](https://github.com/ksr20612/uturi/tree/main/packages/sonification)
- [Issue Tracker](https://github.com/ksr20612/uturi/issues)
