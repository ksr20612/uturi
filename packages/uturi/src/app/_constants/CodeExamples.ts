export const CODE_EXAMPLES = {
  installation: 'npm install @uturi/sonification',

  quickStart: `import { sonify } from '@uturi/sonification';

// Simple array sonification
const salesData = [100, 150, 80, 200, 175, 300];
await sonify(salesData, 'frequency');`,

  reactBasic: `import { sonify } from '@uturi/sonification';
import { useState } from 'react';

function ChartWithSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const chartData = [10, 25, 15, 40, 35, 60];

  const handlePlaySound = async () => {
    setIsPlaying(true);
    try {
      await sonify(chartData, 'frequency');
    } finally {
      setIsPlaying(false);
    }
  };

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

// 1. Frequency variation (higher value = higher pitch)
await sonify(data, 'frequency');

// 2. Volume variation (higher value = louder sound)
await sonify(data, 'volume');

// 3. Rhythm variation (higher value = faster rhythm)
await sonify(data, 'rhythm');

// 4. Melody variation (musical scale: C, D, E, F, G, A, B)
await sonify(data, 'melody');`,

  customConfig: `// Fine-tuned configuration customization
await sonify(salesData, 'frequency', {
  // Basic audio settings
  duration: 3.0,        // 3 seconds playback
  sampleRate: 44100,    // CD quality
  
  // Frequency range (Hz)
  frequency: 440,       // Base frequency (A4 note)
  minFrequency: 200,    // Lowest pitch
  maxFrequency: 800,    // Highest pitch
  
  // Volume range (0-1)
  volume: 0.5,          // Base volume
  minVolume: 0.1,       // Minimum volume
  maxVolume: 0.8,       // Maximum volume
});`,

  realTimeData: `// Real-time data processing example
import { useState, useEffect } from 'react';

function LiveChart({ apiData }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  useEffect(() => {
    if (audioEnabled && apiData?.length > 0) {
      // Use only the latest 10 data points
      const recentData = apiData.slice(-10);
      sonify(recentData, 'frequency', { duration: 1.5 });
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

  accessibilityUse: `// Accessibility usage example
function AccessibleChart({ data, title }) {
  const playChartSound = async () => {
    // Announce audio playback start to user
    const announcement = new SpeechSynthesisUtterance(
      \`Playing sound for \${title} chart with \${data.length} data points\`
    );
    speechSynthesis.speak(announcement);
    
    // Wait briefly, then play chart sound
    setTimeout(async () => {
      await sonify(data, 'melody', {
        // Adjust playback time based on data count
        duration: Math.max(2, data.length * 0.3), 
        volume: 0.6
      });
    }, 1000);
  };

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
