---
"@uturi/sonification": patch
---

fix(sonification): correct flat-data mapping and playback races

Flat or single-value series now map to the middle of each scale instead of the minimum. Worker responses stay tied to the request that produced them, and empty results no longer share one buffer. `cleanup()` rejects in-flight generation, `stop()` skips autoplay while audio is still being generated, and framework hooks keep `isPlaying` on the latest call.
