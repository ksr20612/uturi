import { vi } from 'vitest';

// Mock DOM APIs
Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn(() => ({
    color: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(255, 255, 255)',
    backgroundImage: 'none',
  })),
});

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    style: {},
    getContext: vi.fn(),
    width: 0,
    height: 0,
  })),
});

Object.defineProperty(document.body, 'appendChild', {
  value: vi.fn(),
});

Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn(),
});

// Mock Canvas API
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
    })),
  })),
});

// Mock Image
Object.defineProperty(HTMLImageElement.prototype, 'addEventListener', {
  value: vi.fn(),
});

Object.defineProperty(HTMLImageElement.prototype, 'removeEventListener', {
  value: vi.fn(),
});

