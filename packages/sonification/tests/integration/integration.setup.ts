/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AudioContext as MockAudioContext,
  AudioBuffer as MockAudioBuffer,
  AudioBufferSourceNode as MockAudioBufferSourceNode,
  OscillatorNode as MockOscillatorNode,
  GainNode as MockGainNode,
} from 'standardized-audio-context-mock';

let originalAudioContext: typeof AudioContext | undefined;
let originalWindowAudioContext: typeof AudioContext | undefined;
let originalAudioBuffer: typeof AudioBuffer | undefined;
let originalAudioBufferSourceNode: typeof AudioBufferSourceNode | undefined;
let originalOscillatorNode: typeof OscillatorNode | undefined;
let originalGainNode: typeof GainNode | undefined;

export function applyAudioPolyfill(): void {
  originalAudioContext = (globalThis as any).AudioContext;
  originalWindowAudioContext =
    typeof window !== 'undefined' ? (window as any).AudioContext : undefined;
  originalAudioBuffer = (globalThis as any).AudioBuffer;
  originalAudioBufferSourceNode = (globalThis as any).AudioBufferSourceNode;
  originalOscillatorNode = (globalThis as any).OscillatorNode;
  originalGainNode = (globalThis as any).GainNode;

  (globalThis as any).AudioContext = MockAudioContext;
  (globalThis as any).webkitAudioContext = MockAudioContext;
  (globalThis as any).AudioBuffer = MockAudioBuffer;
  (globalThis as any).AudioBufferSourceNode = MockAudioBufferSourceNode;
  (globalThis as any).OscillatorNode = MockOscillatorNode;
  (globalThis as any).GainNode = MockGainNode;

  if (typeof window !== 'undefined') {
    (window as any).AudioContext = MockAudioContext;
    (window as any).webkitAudioContext = MockAudioContext;
  }
}

export function restoreAudioPolyfill(): void {
  if (originalAudioContext !== undefined) {
    (globalThis as any).AudioContext = originalAudioContext;
  } else {
    delete (globalThis as any).AudioContext;
  }

  if (originalAudioBuffer !== undefined) {
    (globalThis as any).AudioBuffer = originalAudioBuffer;
  } else {
    delete (globalThis as any).AudioBuffer;
  }

  if (originalAudioBufferSourceNode !== undefined) {
    (globalThis as any).AudioBufferSourceNode = originalAudioBufferSourceNode;
  } else {
    delete (globalThis as any).AudioBufferSourceNode;
  }

  if (originalOscillatorNode !== undefined) {
    (globalThis as any).OscillatorNode = originalOscillatorNode;
  } else {
    delete (globalThis as any).OscillatorNode;
  }

  if (originalGainNode !== undefined) {
    (globalThis as any).GainNode = originalGainNode;
  } else {
    delete (globalThis as any).GainNode;
  }

  if (typeof window !== 'undefined') {
    if (originalWindowAudioContext !== undefined) {
      (window as any).AudioContext = originalWindowAudioContext;
      (window as any).webkitAudioContext = originalWindowAudioContext;
    } else {
      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;
    }
  }
}
