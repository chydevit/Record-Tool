# Click Sound UI Controls

## Overview

Users can now control cursor click sounds directly from the **Cursor Settings** panel in the video editor!

## Location

The click sound controls are located in:
1. Open the video editor
2. Click on the **Cursor** tab in the settings panel (left side)
3. Scroll down to find the **Click Sounds** section

## Available Controls

### 1. Enable/Disable Toggle
- **Location**: Top right of the Click Sounds section
- **Function**: Turn click sounds on or off
- **Default**: Enabled (ON)

### 2. Sound Style Dropdown
- **Location**: Below the enable toggle
- **Options**:
  - **Default - Professional**: Clean, neutral click sound
  - **Soft - Gentle & Quiet**: Subtle, quiet click sound
  - **Mechanical - Sharp & Crisp**: Keyboard-like click sound
  - **Pop - Playful & Bouncy**: Fun, bubbly click sound
- **Default**: Default - Professional

### 3. Volume Slider
- **Location**: Below the sound style dropdown
- **Range**: 0% to 100%
- **Default**: 30%
- **Function**: Adjust the volume of click sounds

## Features

### Automatic Sound Selection
The system automatically plays different sounds based on the type of click:
- **Regular clicks** → Uses your selected sound style
- **Double-clicks** → Plays a special double-click sound
- **Right-clicks** → Plays a deeper right-click sound

### Persistent Settings
Your sound preferences are automatically saved and will be remembered:
- Sound enabled/disabled state
- Selected sound style
- Volume level

## UI Screenshot Description

```
┌─────────────────────────────────────────┐
│ CURSOR SETTINGS                         │
├─────────────────────────────────────────┤
│                                         │
│ [Cursor Style Options]                  │
│ [Size Slider]                           │
│ [Speed Slider]                          │
│ [Smoothing Slider]                      │
│ [Motion Blur Slider]                    │
│ [Click Bounce Slider]                   │
│ [Bounce Speed Slider]                   │
│ [Sway Slider]                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ CLICK SOUNDS              [Toggle]  │ │
│ ├─────────────────────────────────────┤ │
│ │                                     │ │
│ │ Sound Style                         │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Default - Professional      ▼   │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │                                     │ │
│ │ Volume                              │ │
│ │ ├────●──────────────────────┤ 30%  │ │
│ │                                     │ │
│ │ Different sounds play for clicks,   │ │
│ │ double-clicks, and right-clicks     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Change to Soft Clicks
1. Open Cursor settings
2. Scroll to Click Sounds section
3. Click the dropdown
4. Select "Soft - Gentle & Quiet"
5. The change is applied immediately

### Example 2: Adjust Volume
1. Open Cursor settings
2. Scroll to Click Sounds section
3. Drag the Volume slider
4. Test by playing your video with cursor clicks

### Example 3: Disable Click Sounds
1. Open Cursor settings
2. Scroll to Click Sounds section
3. Toggle the switch to OFF
4. Click sounds are now muted

### Example 4: Try Different Styles
1. Open Cursor settings
2. Play your video
3. While playing, change the sound style dropdown
4. Hear the difference in real-time

## Technical Details

### State Management
- Settings are stored in `localStorage`
- Synced with `soundManager` in real-time
- Changes apply immediately without restart

### Sound Variants

| Variant | Character | Frequency | Duration | Best For |
|---------|-----------|-----------|----------|----------|
| Default | Professional | 1200-800 Hz | 100ms | Business demos |
| Soft | Gentle | 1000-700 Hz | 80ms | Tutorials |
| Mechanical | Sharp | 1500-1000 Hz | 60ms | Gaming content |
| Pop | Playful | 2000-400 Hz | 150ms | Fun videos |

### Volume Levels

| Setting | Use Case |
|---------|----------|
| 10-20% | Background ambiance |
| 30-40% | Default (recommended) |
| 50-70% | Prominent feedback |
| 80-100% | Maximum emphasis |

## Keyboard Shortcuts (Future)

Planned shortcuts for quick access:
- `Ctrl/Cmd + Shift + S` - Toggle sounds on/off
- `Ctrl/Cmd + Shift + ↑` - Increase volume
- `Ctrl/Cmd + Shift + ↓` - Decrease volume
- `Ctrl/Cmd + Shift + 1-4` - Switch between sound styles

## Tips

1. **Test Before Recording**: Try different sound styles before recording to find your preference
2. **Match Your Content**: Use professional sounds for business, playful for casual content
3. **Volume Balance**: Keep volume at 30-40% to avoid overpowering your narration
4. **Disable for Quiet Scenes**: Turn off sounds for sections that need silence
5. **Preview Changes**: Play your video after changing settings to hear the difference

## Troubleshooting

### Sounds Not Playing
1. Check if the toggle is ON
2. Check if volume is above 0%
3. Verify cursor display is enabled
4. Check browser audio permissions

### Wrong Sound Playing
1. Verify the selected sound style in dropdown
2. Check if you're testing with the right click type
3. Try toggling sounds off and on again

### Volume Too Loud/Quiet
1. Adjust the volume slider
2. Remember: 30% is the default
3. Test with actual video playback

## Integration with Other Features

### Works With
- ✅ All cursor styles (Tahoe, Dot, Figma, etc.)
- ✅ Cursor size adjustments
- ✅ Cursor motion blur
- ✅ Cursor click bounce
- ✅ Cursor sway
- ✅ Loop cursor feature

### Does Not Affect
- ❌ Exported video (sounds are preview-only)
- ❌ Cursor telemetry data
- ❌ Video file size
- ❌ Export performance

## API for Developers

If you want to control sounds programmatically:

```typescript
import { soundManager } from '@/lib/soundManager';

// Enable/disable
soundManager.setEnabled(true);

// Change variant
soundManager.setClickSoundVariant('mechanical');

// Adjust volume
soundManager.setVolume(0.5);

// Check current settings
const enabled = soundManager.isEnabled();
const volume = soundManager.getVolume();
const variant = soundManager.getClickSoundVariant();
```

## Future Enhancements

Planned improvements:
1. **Custom Sound Upload** - Upload your own click sounds
2. **Sound Preview Button** - Test sounds without playing video
3. **Sound Themes** - Predefined sets of sounds
4. **Per-Click-Type Volume** - Different volumes for different click types
5. **Sound Waveform Preview** - Visual representation of sounds
6. **Export with Sounds** - Option to include sounds in exported video

## Feedback

The UI is designed to be:
- **Intuitive**: Easy to find and use
- **Non-intrusive**: Collapsed by default
- **Responsive**: Changes apply immediately
- **Informative**: Clear labels and descriptions

## Summary

The click sound UI controls provide an easy way to:
- ✅ Enable/disable click sounds
- ✅ Choose from 4 sound styles
- ✅ Adjust volume (0-100%)
- ✅ See real-time changes
- ✅ Save preferences automatically

All settings are persistent and sync across sessions!
