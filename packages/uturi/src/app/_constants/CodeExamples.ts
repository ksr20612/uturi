export const CODE_EXAMPLES = {
  installation: `npm install @uturi/sonification
# or
yarn add @uturi/sonification
# or
pnpm add @uturi/sonification`,

  installationParticular: `// you can also install the particular framework version
npm install @uturi/sonification/react
# or
yarn add @uturi/sonification/react
# or
pnpm add @uturi/sonification/react`,

  quickStart: `import { Sonifier } from '@uturi/sonification';

const salesData = [100, 150, 80, 200, 175, 300];
const sonifier = new Sonifier();
sonifier.sonify(salesData, 'frequency', { autoPlay: true });`,

  reactHook: `import { useSonifier } from '@uturi/sonification/react';
import { useCallback } from 'react';

function ChartWithSound() {
  const chartData = [10, 25, 15, 40, 35, 60];
  
  const { sonify, isPlaying, error, result } = useSonifier({
    duration: 2.0,
    volume: 0.5,
  });

  const handlePlaySound = async () => {
    try {
      await sonify(chartData, 'melody', { autoPlay: true });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <button onClick={handlePlaySound} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Chart Sound'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}`,

  vueExample: `import { useSonifier } from '@uturi/sonification/vue';

const chartData = [10, 25, 15, 40, 35, 60];
const { sonify, isPlaying, error, result } = useSonifier({
  duration: 2.0,
  volume: 0.5,
});

const handlePlaySound = async () => {
  try {
    await sonify(chartData, 'volume', { autoPlay: true });
  } catch (err) {
    console.error('Error:', err);
  }
};

<template>
  <div>
    <button @click="handlePlaySound" :disabled="isPlaying">
      {{ isPlaying ? 'Playing...' : 'Play Chart Sound' }}
    </button>
    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>`,

  svelteExample: `import { useSonifier } from '@uturi/sonification/svelte';

const chartData = [10, 25, 15, 40, 35, 60];
const { sonify, isPlaying, error, result } = useSonifier({
  duration: 2.0,
  volume: 0.5,
});

const handlePlaySound = async () => {
  try {
    await sonify(chartData, 'frequency', { autoPlay: true });
  } catch (err) {
    console.error('Error:', err);
  }
};

<button on:click={handlePlaySound} disabled={$isPlaying}>
  {$isPlaying ? 'Playing...' : 'Play Chart Sound'}
</button>
{#if $error}
  <div>Error: {$error.message}</div>
{/if}`,

  frequencyMethod: `// Frequency: Pitch changes according to value
// Higher values produce higher pitches
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'frequency', { autoPlay: true });`,

  volumeMethod: `// Volume: Volume changes according to value
// Higher values produce louder sounds
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'volume', { autoPlay: true });`,

  rhythmMethod: `// Rhythm: Rhythm pattern changes according to value
// Higher values produce faster rhythms
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'rhythm', { autoPlay: true });`,

  melodyMethod: `// Melody: Scale changes according to value
// Creates a musical melody using notes (C, D, E, F, G, A, B)
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'melody', { autoPlay: true });`,

  waveformTypes: `// Three waveform types available
const sonifier = new Sonifier({
  waveType: 'sine',     // default
  // waveType: 'square',
  // waveType: 'sawtooth',
});

// Change waveform dynamically
sonifier.setConfig({
  waveType: 'square',  // Switch to square wave
});

await sonifier.sonify(data, 'frequency', { autoPlay: true });`,

  manualPlayback: `// Generate audio without auto-playing
const sonifier = new Sonifier();
const result = await sonifier.sonify(data, 'melody', { autoPlay: false });

// Play later
await sonifier.play(result.audioBuffer);

// Or use with Web Audio API directly
const audioContext = new AudioContext();
const source = audioContext.createBufferSource();
source.buffer = result.audioBuffer;
source.connect(audioContext.destination);
source.start();`,

  errorHandlingSonificationError: `// SonificationError Class
import { SonificationError, ERROR_CODES } from '@uturi/sonification';

// All errors thrown by the library are instances of SonificationError
class SonificationError extends Error {
  readonly code: SonificationErrorCode;  // Error code to distinguish error types
  readonly cause?: Error;                 // Original error (if any)
  readonly field?: string;                // Field name (for validation errors)
}

// Error Codes
export const ERROR_CODES = {
  WORKER_ERROR: 'WORKER_ERROR',           // Web Worker initialization or execution error
  VALIDATION_ERROR: 'VALIDATION_ERROR',   // Input data or configuration validation failed
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',         // Audio generation timeout
  AUDIO_CONTEXT_ERROR: 'AUDIO_CONTEXT_ERROR', // AudioContext related error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',         // Unknown error
} as const;`,

  errorHandling: `import { Sonifier, SonificationError, ERROR_CODES } from '@uturi/sonification';

const sonifier = new Sonifier();

try {
  const result = await sonifier.sonify(data, 'melody', { autoPlay: true });
  console.log('Success:', result);
} catch (error) {
  if (error instanceof SonificationError) {
    switch (error.code) {
      case ERROR_CODES.VALIDATION_ERROR:
        console.error('Validation error:', error.message);
        console.error('Field:', error.field);
        break;
      case ERROR_CODES.WORKER_ERROR:
        console.error('Worker error:', error.message);
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
}`,

  dynamicConfig: `// Update configuration dynamically
const sonifier = new Sonifier({
  duration: 2.0,
  volume: 0.3,
  waveType: 'sine',
});

// Later, update the configuration
sonifier.setConfig({
  duration: 4.0,
  volume: 0.6,
  waveType: 'square',  // Change waveform type
});

// Get current configuration
const currentConfig = sonifier.getConfig();
console.log('Current config:', currentConfig);`,

  customConfig: `// Fine-tuned configuration customization
const sonifier = new Sonifier({
  // Basic audio settings
  duration: 3.0,        // 3 seconds playback
  sampleRate: 44100,    // CD quality
  waveType: 'square',   // Waveform type: 'sine' | 'square' | 'sawtooth'
  
  // Frequency range (Hz)
  minFrequency: 200,    // Lowest pitch
  maxFrequency: 800,    // Highest pitch
  
  // Volume range (0-1)
  minVolume: 0.1,       // Minimum volume
  maxVolume: 0.8,       // Maximum volume
  
  // Rhythm range (0-1)
  minRhythm: 0.2,       // Minimum rhythm
  maxRhythm: 0.9,       // Maximum rhythm
});

await sonifier.sonify(salesData, 'frequency', { autoPlay: true });`,

  realTimeData: `// Real-time data processing with useRef
import { Sonifier } from '@uturi/sonification';
import { useState, useEffect, useRef } from 'react';

function LiveChart({ apiData }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const sonifierRef = useRef<Sonifier | null>(null);
  
  // Sonifier 인스턴스 초기화
  useEffect(() => {
    sonifierRef.current = new Sonifier({ duration: 1.5 });
    
    return () => {
      sonifierRef.current?.cleanup();
    };
  }, []);
  
  useEffect(() => {
    if (audioEnabled && apiData?.length > 0 && sonifierRef.current) {
      // Use only the latest 10 data points
      const recentData = apiData.slice(-10);
      sonifierRef.current.sonify(recentData, 'frequency', { autoPlay: true });
    }
  }, [apiData, audioEnabled]);

  return (
    <div>
      <button onClick={() => setAudioEnabled(!audioEnabled)}>
        {audioEnabled ? 'Disable' : 'Enable'} Audio Feedback
      </button>
      {/* Chart component */}
    </div>
  );
}`,

  accessibilityUse: `// Accessibility usage example with useRef
import { Sonifier } from '@uturi/sonification';
import { useRef, useEffect, useCallback } from 'react';

function AccessibleChart({ data, title }) {
  const sonifierRef = useRef<Sonifier | null>(null);

  // data 변경 시 Sonifier 재생성
  useEffect(() => {
    sonifierRef.current?.cleanup(); // 기존 인스턴스 정리
    sonifierRef.current = new Sonifier({
      duration: Math.max(2, data.length * 0.3),
      volume: 0.6
    });
    
    return () => {
      sonifierRef.current?.cleanup();
    };
  }, [data.length]);

  const playChartSound = useCallback(async () => {
    if (!sonifierRef.current) return;
    
    // Announce audio playback start to user
    const announcement = new SpeechSynthesisUtterance(
      \`Playing sound for \${title} chart with \${data.length} data points\`
    );
    speechSynthesis.speak(announcement);
    
    // Wait briefly, then play chart sound
    setTimeout(async () => {
      await sonifierRef.current!.sonify(data, 'melody', { autoPlay: true });
    }, 1000);
  }, [data, title]);

  return (
    <div role="img" aria-label={\`\${title} chart\`}>
      <button 
        onClick={playChartSound}
        aria-label={\`Play audio representation of \${title} chart\`}
      >
        🔊 Listen to Chart
      </button>
    </div>
  );
}`,
} as const;
