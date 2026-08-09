const DEFAULT_NUM_BINS = 32;

export class AudioAnalyzer {
  extractFeatures(audio: AudioBuffer, numBins = DEFAULT_NUM_BINS): number[] {
    const channelData = audio.getChannelData(0);
    const binSize = Math.floor(channelData.length / numBins);

    if (binSize === 0) return [];

    const features: number[] = [];

    for (let i = 0; i < numBins; i++) {
      const start = i * binSize;
      const end = Math.min(start + binSize, channelData.length);
      let sum = 0;

      for (let j = start; j < end; j++) {
        sum += Math.abs(channelData[j]);
      }

      features.push(sum / (end - start));
    }

    return features;
  }
}
