export const CODE_EXAMPLES = {
  installation: 'npm install @uturi/sonification',

  quickStart: `import { Sonifier } from '@uturi/sonification';

// Simple array sonification
const salesData = [100, 150, 80, 200, 175, 300];
const sonifier = new Sonifier();
const result = await sonifier.sonify(salesData, 'frequency', { autoPlay: true });`,

  reactBasic: `import { Sonifier } from '@uturi/sonification';
import { useState, useRef, useEffect, useCallback } from 'react';

function ChartWithSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const chartData = [10, 25, 15, 40, 35, 60];
  const sonifierRef = useRef<Sonifier | null>(null);

  // Sonifier 인스턴스 초기화
  useEffect(() => {
    sonifierRef.current = new Sonifier();
    
    return () => {
      sonifierRef.current?.cleanup();
    };
  }, []);

  const handlePlaySound = useCallback(async () => {
    if (!sonifierRef.current) return;
    
    setIsPlaying(true);
    try {
      await sonifierRef.current.sonify(chartData, 'frequency', { autoPlay: true });
    } finally {
      setIsPlaying(false);
    }
  }, [chartData]);

  return (
    <div>
      <button onClick={handlePlaySound} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Chart Sound'}
      </button>
    </div>
  );
}`,

  sonificationMethods: `// 4 different conversion methods
const data = [10, 20, 30, 40, 50];
const sonifier = new Sonifier();

// 1. Frequency variation (higher value = higher pitch)
await sonifier.sonify(data, 'frequency', { autoPlay: true });

// 2. Volume variation (higher value = louder sound)
await sonifier.sonify(data, 'volume', { autoPlay: true });

// 3. Rhythm variation (higher value = faster rhythm)
await sonifier.sonify(data, 'rhythm', { autoPlay: true });

// 4. Melody variation (musical scale: C, D, E, F, G, A, B)
await sonifier.sonify(data, 'melody', { autoPlay: true });`,

  customConfig: `// Fine-tuned configuration customization
const sonifier = new Sonifier({
  // Basic audio settings
  duration: 3.0,        // 3 seconds playback
  sampleRate: 44100,    // CD quality
  
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
