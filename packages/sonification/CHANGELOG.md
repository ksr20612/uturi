# @uturi/sonification

## 2.2.1

### Patch Changes

- 59b6fa2: fix: improve empty data input handling in sound generation

## 2.2.0

### Minor Changes

- b7b2acf: feat(sonification): Add waveform options(squre, sawtooth)

## 2.1.0

### Minor Changes

- bba5ba1: - feat: Add comprehensive error handling with SonificationError class

  - Added `SonificationError` class with error codes
  - Added `ERROR_CODES` constants for error type identification
  - All errors are now consistently wrapped as `SonificationError`
  - Enhanced error information with `code`, `field`, and `cause` properties
  - Improved error handling in framework integrations (React, Vue, Svelte)
  - Added error handling documentation in README

  **New Exports:**

  - `SonificationError` - Custom error class
  - `ERROR_CODES` - Error code constants
  - `SonificationErrorCode` - Error code type

  **Backward Compatibility:**

  - All existing code continues to work
  - `SonificationError` extends `Error`, so existing error handling code is compatible

## 2.0.0

### Major Changes

- e145fc5: Add Vue and Svelte support with framework-specific hooks

  This major release extends @uturi/sonification to support Vue and Svelte frameworks in addition to React. Framework-specific hooks/composables are now available through subpath exports.

  **New Features:**

  - Vue support: `useSonifier` composable via `@uturi/sonification/vue`
  - Svelte support: `useSonifier` function via `@uturi/sonification/svelte`
  - Subpath exports for framework-specific implementations (`/react`, `/vue`, `/svelte`, `/core`)

  **Changes:**

  - Added optional peer dependencies for Vue and Svelte
  - Updated package exports to include framework-specific entry points
  - Enhanced documentation with framework-specific examples

  **Migration:**

  - React users: No changes required, existing imports continue to work
  - Vue/Svelte users: Import from the framework-specific subpath
  - Core users: Can now import from `@uturi/sonification/core` for tree-shaking

## 1.1.0

### Minor Changes

- ac18c3d: feat(sonification): useSonifier hook added for React projects

## 1.0.0

### Major Changes

- 33c0f83: release(sonification): v1.0.0

## 0.2.1

### Patch Changes

- 98663e1: fix(sonification): web worker optimized

## 0.2.0

### Minor Changes

- 1bee890: feat(sonification): setConfig added

## 0.1.0

### Minor Changes

- da810f6: feat: 음성 생성 최적화(Web Worker)

## 0.0.6

### Patch Changes

- aa78e16: data interpolation modified

## 0.0.5

### Patch Changes

- 601df7e: data interpolation logic modified

## 0.0.3

### Patch Changes

- c94d4bb: test release

## 0.0.2

### Patch Changes

- 7ad9015: test release

## 0.0.1

### Patch Changes

- 0e3e319: test release

## 0.0.2

### Patch Changes

- 64ae201: test release

## 0.0.1

### Patch Changes

- be52838: test release
