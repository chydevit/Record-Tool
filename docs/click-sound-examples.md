# Click Sound Usage Examples

## Basic Usage

The click sound feature works automatically once implemented. Here are some examples of how to customize and extend it.

## Example 1: Disable Click Sounds

```typescript
import { soundManager } from '@/lib/soundManager';

// Disable click sounds
soundManager.setEnabled(false);

// Re-enable later
soundManager.setEnabled(true);
```

## Example 2: Adjust Volume

```typescript
import { soundManager } from '@/lib/soundManager';

// Set volume to 50%
soundManager.setVolume(0.5);

// Set volume to 10% (very quiet)
soundManager.setVolume(0.1);

// Set volume to 100% (maximum)
soundManager.setVolume(1.0);
```

## Example 3: Load Custom Click Sound

```typescript
import { soundManager } from '@/lib/soundManager';

// Load from a URL
soundManager.loadClickSound('/sounds/custom-click.wav');

// Load from a data URL
const customSound = 'data:audio/wav;base64,...';
soundManager.loadClickSound(customSound);

// Load from a file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  soundManager.loadClickSound(url);
});
```

## Example 4: Add UI Controls (Settings Panel)

```typescript
// In SettingsPanel.tsx or similar component

import { soundManager } from '@/lib/soundManager';
import { useState } from 'react';

function CursorSoundSettings() {
  const [enabled, setEnabled] = useState(soundManager.isEnabled());
  const [volume, setVolume] = useState(soundManager.getVolume());

  const handleEnabledChange = (checked: boolean) => {
    setEnabled(checked);
    soundManager.setEnabled(checked);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    soundManager.setVolume(value);
  };

  return (
    <div className="cursor-sound-settings">
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => handleEnabledChange(e.target.checked)}
        />
        Enable Click Sounds
      </label>

      {enabled && (
        <div>
          <label>Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
```

## Example 5: Different Sounds for Different Click Types

```typescript
// Extend the sound manager to support multiple sounds

class ExtendedSoundManager {
  private sounds = {
    click: null as HTMLAudioElement | null,
    doubleClick: null as HTMLAudioElement | null,
    rightClick: null as HTMLAudioElement | null,
  };

  loadSound(type: 'click' | 'doubleClick' | 'rightClick', url: string) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds[type] = audio;
  }

  playSound(type: 'click' | 'doubleClick' | 'rightClick') {
    const audio = this.sounds[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.debug);
    }
  }
}

// In cursorRenderer.ts, modify the click detection:
const interactionType = latestClick?.interactionType;
if (interactionType === 'double-click') {
  extendedSoundManager.playSound('doubleClick');
} else if (interactionType === 'right-click') {
  extendedSoundManager.playSound('rightClick');
} else {
  extendedSoundManager.playSound('click');
}
```

## Example 6: Generate Different Click Sounds

```typescript
import { generateClickSoundAsync } from '@/lib/generateClickSound';

// Generate a higher-pitched click
async function generateHighPitchClick(): Promise<string> {
  const sampleRate = 44100;
  const duration = 0.08;
  const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Higher frequency
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.02);

  gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(0);
  oscillator.stop(duration);

  const audioBuffer = await audioContext.startRendering();
  // ... convert to WAV and return URL
}

// Generate a lower-pitched click
async function generateLowPitchClick(): Promise<string> {
  // Similar but with lower frequencies (e.g., 600Hz → 400Hz)
}
```

## Example 7: Spatial Audio (Panning)

```typescript
// Add panning based on cursor position

class SpatialSoundManager {
  private audioContext: AudioContext;
  private panners: StereoPannerNode[] = [];

  constructor() {
    this.audioContext = new AudioContext();
  }

  playClickAtPosition(x: number, y: number) {
    // x ranges from 0 (left) to 1 (right)
    // Convert to pan value: -1 (left) to 1 (right)
    const pan = (x - 0.5) * 2;

    const source = this.audioContext.createBufferSource();
    const panner = this.audioContext.createStereoPanner();
    
    panner.pan.value = pan;
    
    source.connect(panner);
    panner.connect(this.audioContext.destination);
    
    source.start();
  }
}

// In cursorRenderer.ts:
const cursorX = this.state.x; // 0 to 1
const cursorY = this.state.y; // 0 to 1
spatialSoundManager.playClickAtPosition(cursorX, cursorY);
```

## Example 8: Click Sound Preferences Persistence

```typescript
// Save preferences to localStorage

interface ClickSoundPreferences {
  enabled: boolean;
  volume: number;
}

function saveClickSoundPreferences(prefs: ClickSoundPreferences) {
  localStorage.setItem('clickSoundPreferences', JSON.stringify(prefs));
}

function loadClickSoundPreferences(): ClickSoundPreferences {
  const stored = localStorage.getItem('clickSoundPreferences');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    enabled: true,
    volume: 0.3,
  };
}

// On app initialization:
const prefs = loadClickSoundPreferences();
soundManager.setEnabled(prefs.enabled);
soundManager.setVolume(prefs.volume);

// When user changes settings:
soundManager.setVolume(newVolume);
saveClickSoundPreferences({
  enabled: soundManager.isEnabled(),
  volume: newVolume,
});
```

## Example 9: Click Sound with Visual Feedback

```typescript
// Show a visual ripple when click sound plays

function showClickRipple(x: number, y: number) {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 500);
}

// CSS:
// .click-ripple {
//   position: absolute;
//   width: 20px;
//   height: 20px;
//   border: 2px solid rgba(255, 255, 255, 0.8);
//   border-radius: 50%;
//   animation: ripple 0.5s ease-out;
//   pointer-events: none;
// }
//
// @keyframes ripple {
//   from {
//     transform: scale(0);
//     opacity: 1;
//   }
//   to {
//     transform: scale(3);
//     opacity: 0;
//   }
// }

// In cursorRenderer.ts:
if (latestClick && latestClick.timeMs !== this.lastClickTimeMs) {
  this.lastClickTimeMs = latestClick.timeMs;
  soundManager.playClick();
  showClickRipple(px, py); // px, py are cursor screen coordinates
}
```

## Example 10: Debug Mode

```typescript
// Add debug logging for click sound events

class DebugSoundManager extends SoundManager {
  private debugMode = false;

  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
  }

  playClick() {
    if (this.debugMode) {
      console.log('[ClickSound] Playing click at', new Date().toISOString());
    }
    super.playClick();
  }

  loadClickSound(soundPath: string) {
    if (this.debugMode) {
      console.log('[ClickSound] Loading sound from', soundPath);
    }
    super.loadClickSound(soundPath);
  }
}

// Usage:
debugSoundManager.setDebugMode(true);
```

## Example 11: Click Sound Analytics

```typescript
// Track click sound usage

class AnalyticsSoundManager {
  private clickCount = 0;
  private lastClickTime = 0;

  playClick() {
    this.clickCount++;
    const now = Date.now();
    const timeSinceLastClick = now - this.lastClickTime;
    this.lastClickTime = now;

    // Send analytics
    analytics.track('cursor_click_sound_played', {
      clickCount: this.clickCount,
      timeSinceLastClick,
    });

    soundManager.playClick();
  }

  getStats() {
    return {
      totalClicks: this.clickCount,
      lastClickTime: this.lastClickTime,
    };
  }
}
```

## Example 12: Keyboard Shortcut to Toggle

```typescript
// Add keyboard shortcut to toggle click sounds

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + Shift + S to toggle click sounds
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      const newState = !soundManager.isEnabled();
      soundManager.setEnabled(newState);
      
      // Show toast notification
      toast(newState ? 'Click sounds enabled' : 'Click sounds disabled');
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Testing Examples

### Unit Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { soundManager } from '@/lib/soundManager';

describe('SoundManager', () => {
  it('should enable and disable sounds', () => {
    soundManager.setEnabled(true);
    expect(soundManager.isEnabled()).toBe(true);

    soundManager.setEnabled(false);
    expect(soundManager.isEnabled()).toBe(false);
  });

  it('should set volume within valid range', () => {
    soundManager.setVolume(0.5);
    expect(soundManager.getVolume()).toBe(0.5);

    soundManager.setVolume(1.5); // Should clamp to 1.0
    expect(soundManager.getVolume()).toBe(1.0);

    soundManager.setVolume(-0.5); // Should clamp to 0.0
    expect(soundManager.getVolume()).toBe(0.0);
  });

  it('should not play when disabled', () => {
    const playSpy = vi.spyOn(HTMLAudioElement.prototype, 'play');
    
    soundManager.setEnabled(false);
    soundManager.playClick();
    
    expect(playSpy).not.toHaveBeenCalled();
  });
});
```

### Integration Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { VideoPlayback } from './VideoPlayback';
import { soundManager } from '@/lib/soundManager';

describe('VideoPlayback with Click Sounds', () => {
  it('should initialize click sound on mount', async () => {
    const loadSpy = vi.spyOn(soundManager, 'loadClickSound');
    
    render(<VideoPlayback {...defaultProps} />);
    
    // Wait for async sound generation
    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalled();
    });
  });
});
```

## Performance Optimization Examples

### Lazy Loading

```typescript
// Only load click sound when cursor is enabled

useEffect(() => {
  if (showCursor && !soundManager.isLoaded()) {
    generateClickSoundAsync().then((url) => {
      soundManager.loadClickSound(url);
    });
  }
}, [showCursor]);
```

### Debouncing

```typescript
// Prevent too many rapid clicks from overwhelming the audio system

class DebouncedSoundManager {
  private lastPlayTime = 0;
  private minInterval = 50; // ms

  playClick() {
    const now = Date.now();
    if (now - this.lastPlayTime < this.minInterval) {
      return; // Skip this click
    }
    this.lastPlayTime = now;
    soundManager.playClick();
  }
}
```
