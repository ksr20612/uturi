---
'@uturi/sonification': minor
---

- feat: Add comprehensive error handling with SonificationError class
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
