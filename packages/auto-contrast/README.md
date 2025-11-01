# @uturi/auto-contrast

A comprehensive accessibility library that automatically adjusts text colors based on background elements to meet WCAG 2.2 standards. Unlike [Contrast.js](https://contrastjs.com/) which focuses only on background images, this library handles all types of DOM elements including divs, buttons, and other elements with various background types.

## 🎨 Features

- **Universal Background Support**: Works with solid colors, gradients, images, and any CSS background
- **WCAG 2.2 Compliance**: Automatically ensures AA (4.5:1) and AAA (7.0:1) contrast ratios
- **DOM Integration**: Direct manipulation of DOM elements for seamless integration
- **Responsive Design**: Automatically adjusts colors when window size changes
- **Multiple Background Types**: Solid colors, gradients, background images, and more
- **TypeScript Support**: Full type safety and IntelliSense support
- **Accessibility Focused**: Built specifically for web accessibility compliance

## 📦 Installation

```bash
npm install @uturi/auto-contrast
# or
yarn add @uturi/auto-contrast
# or
pnpm add @uturi/auto-contrast
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { AutoContrast } from '@uturi/auto-contrast';

// Create and launch AutoContrast
const autoContrast = new AutoContrast();

// AutoContrast will automatically find and adjust elements with class 'auto-contrast'
```

### HTML Setup

```html
<div class="auto-contrast-bg" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4);">
  <h1 class="auto-contrast">This text will be automatically adjusted</h1>
</div>

<button class="auto-contrast" style="background-color: #666666;">Button with auto-contrast</button>
```

### Advanced Configuration

```typescript
import { AutoContrast } from '@uturi/auto-contrast';

const autoContrast = new AutoContrast({
  standard: 'AAA', // Use WCAG AAA standard (7.0:1)
  minContrastRatio: 7.0, // Custom minimum ratio
  targetSelector: '.my-text', // Custom target selector
  backgroundSelector: '.my-bg', // Custom background selector
  lightColor: '#FFFFFF', // Light text color
  darkColor: '#000000', // Dark text color
  customColors: ['#FF0000', '#00FF00'], // Custom color options
  isResponsive: true, // Enable responsive mode
  debounceTime: 150, // Debounce time for resize events
  debug: true, // Enable debug logging
});

// Manual control
autoContrast.launch(); // Start AutoContrast
autoContrast.stop(); // Stop AutoContrast
autoContrast.update(); // Update all elements
```

## 🎛️ Configuration Options

### AutoContrastConfig

```typescript
interface AutoContrastConfig {
  // WCAG standard settings
  standard?: 'AA' | 'AAA'; // WCAG standard (default: 'AA')
  minContrastRatio?: number; // Minimum contrast ratio (default: 4.5 for AA, 7.0 for AAA)

  // DOM selectors
  targetSelector?: string; // Target element selector (default: '.auto-contrast')
  backgroundSelector?: string; // Background element selector (default: '.auto-contrast-bg')

  // Color options
  lightColor?: string; // Light text color (default: '#000000')
  darkColor?: string; // Dark text color (default: '#FFFFFF')
  customColors?: string[]; // Custom color options

  // Analysis settings
  sampleSize?: number; // Color analysis sample size (default: 10)
  tolerance?: number; // Color tolerance (default: 0.1)

  // Behavior settings
  isResponsive?: boolean; // Responsive mode (default: true)
  debounceTime?: number; // Debounce time for resize events (default: 100ms)
  autoLaunch?: boolean; // Auto launch (default: true)

  // Debug settings
  debug?: boolean; // Debug mode (default: false)
}
```

## 📊 API Reference

### AutoContrast Class

```typescript
class AutoContrast {
  // Lifecycle methods
  launch(): void; // Start AutoContrast
  stop(): void; // Stop AutoContrast
  update(): Promise<void>; // Update all elements

  // Element methods
  adjustElement(element: HTMLElement): Promise<ContrastResult | null>;
  analyzeBackground(element: HTMLElement): Promise<ColorAnalysis>;

  // Configuration
  getConfig(): Required<AutoContrastConfig>;
  setConfig(config: Partial<AutoContrastConfig>): void;

  // State
  isActive: boolean; // Whether AutoContrast is active
  results: ContrastResult[]; // Array of adjustment results
}
```

### Return Types

```typescript
interface ContrastResult {
  element: HTMLElement; // The adjusted element
  originalColor: string; // Original text color
  adjustedColor: string; // New text color
  backgroundColor: string; // Background color
  contrastRatio: number; // Final contrast ratio
  meetsStandard: boolean; // Whether it meets WCAG standard
  method: 'light' | 'dark' | 'custom'; // Method used
  isAccessible: boolean; // Overall accessibility status
}

interface ColorAnalysis {
  averageColor: string; // Average background color
  dominantColor: string; // Dominant background color
  luminance: number; // Background luminance (0-1)
  isLight: boolean; // Whether background is light
  isDark: boolean; // Whether background is dark
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}
```

## 🎨 Usage Examples

### React Integration

```tsx
import React, { useEffect, useRef } from 'react';
import { AutoContrast } from '@uturi/auto-contrast';

const AccessibleComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoContrastRef = useRef<AutoContrast>();

  useEffect(() => {
    autoContrastRef.current = new AutoContrast({
      targetSelector: '.accessible-text',
      backgroundSelector: '.accessible-bg',
      debug: true,
    });

    return () => {
      autoContrastRef.current?.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="accessible-bg"
      style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' }}
    >
      <h1 className="accessible-text">This text will be automatically adjusted</h1>
      <p className="accessible-text">All text in this container will have optimal contrast</p>
    </div>
  );
};
```

### Vue Integration

```vue
<template>
  <div class="auto-contrast-bg" :style="backgroundStyle">
    <h1 class="auto-contrast">{{ title }}</h1>
    <p class="auto-contrast">{{ description }}</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { AutoContrast } from '@uturi/auto-contrast';

const backgroundStyle = ref('background: linear-gradient(45deg, #ff6b6b, #4ecdc4)');
let autoContrast;

onMounted(() => {
  autoContrast = new AutoContrast({
    debug: true,
  });
});

onUnmounted(() => {
  autoContrast?.stop();
});
</script>
```

### Vanilla JavaScript

```javascript
import { AutoContrast } from '@uturi/auto-contrast';

// Initialize with custom settings
const autoContrast = new AutoContrast({
  targetSelector: '.my-text',
  backgroundSelector: '.my-bg',
  customColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  debug: true,
});

// Manual control
document.getElementById('start-btn').addEventListener('click', () => {
  autoContrast.launch();
});

document.getElementById('stop-btn').addEventListener('click', () => {
  autoContrast.stop();
});

document.getElementById('update-btn').addEventListener('click', () => {
  autoContrast.update();
});
```

## 🔧 Advanced Features

### Custom Color Analysis

```typescript
const autoContrast = new AutoContrast({
  customColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  sampleSize: 20, // More detailed analysis
  tolerance: 0.05, // Higher precision
});

// Analyze specific element
const analysis = await autoContrast.analyzeBackground(element);
console.log('Background analysis:', analysis);
```

### Responsive Mode

```typescript
const autoContrast = new AutoContrast({
  isResponsive: true,
  debounceTime: 200, // Wait 200ms after resize
});

// AutoContrast will automatically update when window size changes
```

### Debug Mode

```typescript
const autoContrast = new AutoContrast({
  debug: true,
});

// Check results
console.log('Adjustment results:', autoContrast.results);
```

## 📋 Requirements

- **Node.js**: 18.0.0 or higher
- **Browser**: Modern browsers with CSS and Canvas support
- **TypeScript**: 5.0.0 or higher (for development)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🎨 Accessibility

This library is designed to enhance web accessibility by ensuring color contrast meets WCAG 2.2 standards. It helps developers create more accessible web applications by automatically adjusting text colors based on background elements.

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🆚 Comparison with Contrast.js

| Feature           | Contrast.js | @uturi/auto-contrast |
| ----------------- | ----------- | -------------------- |
| Background Images | ✅          | ✅                   |
| Solid Colors      | ❌          | ✅                   |
| Gradients         | ❌          | ✅                   |
| DOM Elements      | Limited     | ✅                   |
| WCAG Compliance   | Manual      | ✅ Automatic         |
| TypeScript        | ❌          | ✅                   |
| Responsive        | ✅          | ✅                   |
| Custom Colors     | ✅          | ✅                   |
| Multiple Elements | ❌          | ✅                   |

## 📚 Examples

### E-commerce Product Cards

```html
<div
  class="product-card auto-contrast-bg"
  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
>
  <h3 class="auto-contrast">Premium Headphones</h3>
  <p class="auto-contrast">High-quality wireless headphones with noise cancellation</p>
  <button class="auto-contrast">Add to Cart</button>
</div>
```

### Dashboard Widgets

```html
<div class="widget auto-contrast-bg" style="background-color: #f8f9fa;">
  <div class="auto-contrast">
    <h4>Sales Overview</h4>
    <p>Total revenue: $125,000</p>
  </div>
</div>
```

### Hero Sections

```html
<section
  class="hero auto-contrast-bg"
  style="background-image: url('hero-bg.jpg'); background-size: cover;"
>
  <h1 class="auto-contrast">Welcome to Our Platform</h1>
  <p class="auto-contrast">Discover amazing features and capabilities</p>
  <button class="auto-contrast">Get Started</button>
</section>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

