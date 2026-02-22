import type { VibrationDriver, HapticSequence } from '../types';

export class WebDriver implements VibrationDriver {
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  async play(sequence: HapticSequence): Promise<void> {
    if (!this.isSupported() || sequence.length === 0) return;

    const pattern = sequence.flatMap((frame) => [frame.duration, frame.pause]);

    if (pattern[pattern.length - 1] === 0) {
      pattern.pop();
    }

    navigator.vibrate(pattern);
  }

  stop(): void {
    if (this.isSupported()) {
      navigator.vibrate(0);
    }
  }
}
