# Cursor Click Sounds - 10 Variants

## Overview
The cursor click sound system now includes **10 different sound variants** that users can select from the UI. Each sound has unique characteristics and is generated procedurally using the Web Audio API.

## Sound Variants

### 1. **Default - Professional**
- **Frequency**: 1200Hz → 800Hz
- **Duration**: 100ms
- **Character**: Clean, professional tone suitable for business presentations
- **Use Case**: General purpose, professional videos

### 2. **Soft - Gentle & Quiet**
- **Frequency**: 1000Hz → 700Hz
- **Duration**: 80ms
- **Volume**: Quieter (20% gain)
- **Character**: Subtle, gentle click that doesn't distract
- **Use Case**: Tutorials, educational content

### 3. **Mechanical - Sharp & Crisp**
- **Frequency**: 1500Hz → 1000Hz
- **Duration**: 60ms
- **Waveform**: Square wave with lowpass filter
- **Character**: Sharp, crisp mechanical keyboard-like sound
- **Use Case**: Coding videos, tech content

### 4. **Pop - Playful & Bouncy**
- **Frequency**: 2000Hz → 400Hz
- **Duration**: 150ms
- **Character**: Fun, bubbly pop sound with wide frequency sweep
- **Use Case**: Creative content, casual videos

### 5. **Bubble - Water Droplet** ✨ NEW
- **Frequency**: 600Hz → 300Hz → 450Hz (wobble)
- **Duration**: 200ms
- **Character**: Water droplet effect with frequency wobble
- **Use Case**: Playful content, UI demonstrations

### 6. **Wooden - Natural Knock** ✨ NEW
- **Frequency**: 400Hz → 250Hz
- **Duration**: 90ms
- **Waveform**: Triangle wave with lowpass filter
- **Character**: Natural wooden block knock sound
- **Use Case**: Organic, natural-feeling content

### 7. **Metallic - Metal Tap** ✨ NEW
- **Frequency**: Dual oscillators (2400Hz + 3200Hz) → (1800Hz + 2400Hz)
- **Duration**: 180ms
- **Character**: Metallic ring with longer decay, like tapping metal
- **Use Case**: Industrial, tech, or futuristic content

### 8. **Glass - Crystal Ring** ✨ NEW
- **Frequency**: Dual oscillators (3800Hz + 5200Hz) → (3200Hz + 4400Hz)
- **Duration**: 250ms
- **Character**: High-frequency glass-like tone with crystal ring
- **Use Case**: Elegant, premium content

### 9. **Swoosh - Air Whoosh** ✨ NEW
- **Type**: Bandpass filtered white noise
- **Frequency**: 2000Hz → 800Hz (filter sweep)
- **Duration**: 120ms
- **Character**: Air whoosh effect, like a quick swipe
- **Use Case**: Modern UI, motion graphics

### 10. **Beep - Electronic Tone** ✨ NEW
- **Frequency**: 1800Hz (constant)
- **Duration**: 80ms
- **Character**: Pure electronic beep, like a button press
- **Use Case**: Tech interfaces, electronic content

## Automatic Sound Selection

In addition to the user-selected variant for regular clicks, the system automatically plays different sounds for:

- **Double-Click**: Two quick clicks in sequence (1300Hz + 1400Hz)
- **Right-Click**: Deeper tone (800Hz → 500Hz, 120ms)
- **Middle-Click**: Uses the selected variant

## Technical Details

### Audio Generation
- All sounds are generated procedurally using the Web Audio API
- No external audio files required
- Sounds are generated once on app load and cached

### Audio Pooling
- Each sound type has a pool of 5 audio elements
- Prevents audio clipping when clicks happen rapidly
- Round-robin playback through the pool

### Performance
- Total of 12 sound types loaded (10 variants + double-click + right-click)
- Each pool has 5 elements = 60 total audio elements
- Minimal memory footprint (~50KB total for all sounds)

## UI Controls

Users can control the click sounds through the Cursor Settings panel:

1. **Enable/Disable Toggle**: Turn click sounds on/off
2. **Sound Style Dropdown**: Select from 10 different sound variants
3. **Volume Slider**: Adjust volume from 0-100%
4. **Info Text**: Explains automatic sound selection for different click types

## Settings Persistence

All sound settings are saved to localStorage and restored on app restart:
- `cursorClickSoundEnabled` (boolean, default: true)
- `cursorClickSoundVolume` (number, default: 0.3)
- `cursorClickSoundVariant` (string, default: 'default')

## Usage Example

```typescript
// The sound system is automatically initialized
// Users select sounds through the UI

// Programmatic usage (if needed):
import { soundManager } from '@/lib/soundManager';

// Set variant
soundManager.setClickSoundVariant('bubble');

// Set volume
soundManager.setVolume(0.5); // 50%

// Enable/disable
soundManager.setEnabled(true);

// Play sounds
soundManager.playClick(); // Uses selected variant
soundManager.playDoubleClick(); // Automatic
soundManager.playRightClick(); // Automatic
```

## Files Modified

1. **src/lib/generateClickSound.ts**
   - Added 6 new sound generators
   - Updated type definitions
   - Updated `generateAllClickSounds()` function

2. **src/lib/soundManager.ts**
   - Updated type definitions for 10 variants
   - Updated sound pool initialization
   - Updated `loadAllSounds()` method

3. **src/components/video-editor/SettingsPanel.tsx**
   - Added 6 new options to Sound Style dropdown
   - Updated type definitions

4. **src/components/video-editor/VideoEditor.tsx**
   - Updated state type for `cursorClickSoundVariant`

5. **src/components/video-editor/editorPreferences.ts**
   - Updated type definition for `cursorClickSoundVariant`

## Testing

To test the sounds in the browser console:

```javascript
// Test all variants
const variants = ['default', 'soft', 'mechanical', 'pop', 'bubble', 'wooden', 'metallic', 'glass', 'swoosh', 'beep'];

variants.forEach((variant, index) => {
  setTimeout(() => {
    soundManager.setClickSoundVariant(variant);
    soundManager.playClick();
    console.log(`Playing: ${variant}`);
  }, index * 500);
});
```

## Future Enhancements

Possible future additions:
- Custom sound upload
- Sound preview in UI
- Per-click-type sound customization
- Sound effects (reverb, echo, etc.)
- Volume per sound type
- Import/export sound presets
