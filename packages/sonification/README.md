# @uturi/sonification

A data sonification library that transforms numerical data into musical melodies, enabling visually impaired users to experience data audibly. Inspired by synesthesia—a condition where people experience colors when hearing music—and synesthetic imagery in literature, this library bridges the gap between visual and auditory perception.

## 🎵 Features

- **4 Sonification Methods**: frequency, volume, rhythm, melody
- **Flexible Configuration**: Adjust parameters such as frequency, volume, rhythm, and more
- **TypeScript Support**: Full type safety
- **Accessibility Focused**: An alternative to data visualization for the visually impaired

## 📦 Installation

```bash
npm install @uturi/sonification
# or
yarn add @uturi/sonification
# or
pnpm add @uturi/sonification
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { Sonifier } from '@uturi/sonification';

// Simple usage
const data = [10, 50, 30, 80, 20, 90, 40, 70];
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'frequency', { autoPlay: true });

console.log('Generated data points:', result.dataPoints);
console.log('Audio duration:', result.duration);
```

### Advanced Configuration

```typescript
import { Sonifier } from '@uturi/sonification';

const sonifier = new Sonifier({
  sampleRate: 44100,
  duration: 3.0,
  frequency: 440,
  volume: 0.5,
});

const result = await sonifier.sonify([1, 2, 3, 4, 5], 'melody', {
  autoPlay: true,
});

console.log('Generated data points:', result.dataPoints);
console.log('Audio duration:', result.duration);
```

## 🎛️ Sonification Methods

### 1. Frequency

The frequency changes according to the value.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'frequency', { autoPlay: true });
```

### 2. Volume

The volume changes according to the value.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'volume', { autoPlay: true });
```

### 3. Rhythm

The rhythm pattern changes according to the value.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'rhythm', { autoPlay: true });
```

### 4. Melody

The scale changes according to the value, creating a melody.

```typescript
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'melody', { autoPlay: true });
```

## ⚙️ Configuration Options

### SonifierConfig

```typescript
interface SonifierConfig {
  // Basic audio settings
  sampleRate?: number; // Sample rate (default: 44100)
  duration?: number; // Audio duration (default: 2.0 seconds)

  // Frequency settings
  frequency?: number; // Base frequency (default: 825Hz)
  minFrequency?: number; // Minimum frequency (default: 150Hz)
  maxFrequency?: number; // Maximum frequency (default: 1500Hz)

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
  autoPlay?: boolean; // Whether to play audio automatically
}
```

## 📊 Return Data

### SonifierResult

```typescript
interface SonifierResult {
  audioBuffer: AudioBuffer; // Generated audio buffer
  duration: number; // Audio duration (seconds)
  dataPoints: DataPoint[]; // Array of data points
}
```

### DataPoint

```typescript
interface DataPoint {
  value: number; // Original value
  timestamp: number; // Time position (seconds)
  volume: number; // Volume value
  frequency: number; // Frequency value
  note?: string; // Note name (only for melody method)
}
```

## 📋 Requirements

- **Node.js**: 18.0.0 or higher
- **Browser**: Web Audio API supported browsers
- **TypeScript**: 5.0.0 or higher (for development)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🎵 Accessibility

This library is developed to enhance data accessibility for visually impaired users. By providing an auditory alternative to data visualization, it helps everyone understand data more effectively.
