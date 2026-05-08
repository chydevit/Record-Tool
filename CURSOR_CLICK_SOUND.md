# Cursor Click Sound Feature

This document describes the cursor click sound feature added to Recordly.

## Overview

The cursor click sound feature plays a subtle audio feedback when cursor clicks are detected during video playback. This enhances the viewing experience by providing auditory confirmation of click events.

## Implementation

### Components

1. **Sound Manager** (`src/lib/soundManager.ts`)
   - Manages audio playback with a pool of audio elements for overlapping sounds
   - Provides volume control and enable/disable functionality
   - Handles multiple rapid clicks without audio clipping

2. **Click Sound Generator** (`src/lib/generateClickSound.ts`)
   - Generates a pleasant click sound using the Web Audio API
   - Creates a short, high-pitched tone with quick decay
   - No external audio files needed

3. **Cursor Renderer Integration** (`src/components/video-editor/videoPlayback/cursorRenderer.ts`)
   - Detects click events from cursor telemetry
   - Triggers sound playback when clicks occur
   - Prevents duplicate sounds for the same click

4. **Video Playback Integration** (`src/components/video-editor/VideoPlayback.tsx`)
   - Initializes the sound manager on component mount
   - Loads the generated click sound

### Constants

New constants added to `src/components/video-editor/types.ts`:
- `DEFAULT_CURSOR_CLICK_SOUND = true` - Enable click sounds by default
- `DEFAULT_CURSOR_CLICK_SOUND_VOLUME = 0.3` - Default volume (30%)

## Usage

The click sound feature works automatically when:
1. Cursor display is enabled (`showCursor = true`)
2. Cursor telemetry contains click events
3. Video is playing or being scrubbed

### Customization

You can customize the click sound behavior:

```typescript
import { soundManager } from '@/lib/soundManager';

// Enable/disable click sounds
soundManager.setEnabled(true);

// Adjust volume (0.0 to 1.0)
soundManager.setVolume(0.5);

// Load a custom click sound
soundManager.loadClickSound('/path/to/custom-click.wav');
```

## Technical Details

### Audio Pool
The sound manager uses a pool of 5 audio elements to handle rapid successive clicks without audio clipping or interruption.

### Click Detection
Clicks are detected by monitoring the `clickProgress` value from cursor telemetry. A sound is triggered when:
- `clickProgress > 0` (click is active)
- `clickProgress > 0.9` (near the start of the click)
- The click timestamp is different from the last played click

### Supported Click Types
- Left click
- Right click
- Double click
- Middle click

## Browser Compatibility

The feature uses standard Web APIs:
- `HTMLAudioElement` for playback
- `OfflineAudioContext` for sound generation
- `AudioBuffer` and WAV encoding

All modern browsers support these APIs.

## Performance

- Audio generation happens once on component mount
- Audio pool prevents memory allocation during playback
- Minimal CPU overhead for click detection
- No network requests for audio files

## Future Enhancements

Possible improvements:
1. Add UI controls for volume and enable/disable
2. Support custom click sound uploads
3. Different sounds for different click types
4. Sound variations based on click intensity
5. Spatial audio based on cursor position
