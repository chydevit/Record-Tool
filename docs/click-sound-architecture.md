# Click Sound Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     VideoPlayback Component                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ useEffect (on mount)                                        │ │
│  │   1. Generate click sound (Web Audio API)                  │ │
│  │   2. Load sound into soundManager                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Sound Manager      │
                    │                      │
                    │  - Audio Pool (5x)   │
                    │  - Volume Control    │
                    │  - Enable/Disable    │
                    └──────────────────────┘
                               ▲
                               │
┌──────────────────────────────┼────────────────────────────────────┐
│                  PixiCursorOverlay (Renderer)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ render() method                                             │ │
│  │   1. Get cursor visual state (includes clickProgress)      │ │
│  │   2. Check if click is active (clickProgress > 0.9)        │ │
│  │   3. Find latest click from telemetry                      │ │
│  │   4. Compare with lastClickTimeMs                          │ │
│  │   5. If new click → soundManager.playClick()               │ │
│  │   6. Update lastClickTimeMs                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ▲                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               │
                    ┌──────────────────────┐
                    │  Cursor Telemetry    │
                    │                      │
                    │  - Position data     │
                    │  - Click events      │
                    │  - Timestamps        │
                    └──────────────────────┘
```

## Component Interaction

### 1. Initialization Phase

```
VideoPlayback Mount
    │
    ├─► generateClickSoundAsync()
    │       │
    │       ├─► Create OfflineAudioContext
    │       ├─► Generate sine wave (1200Hz → 800Hz)
    │       ├─► Apply gain envelope (attack/decay)
    │       ├─► Render to AudioBuffer
    │       └─► Convert to WAV Blob → Data URL
    │
    └─► soundManager.loadClickSound(url)
            │
            └─► Load into audio pool (5 elements)
```

### 2. Playback Phase

```
Video Frame Render
    │
    ├─► PixiCursorOverlay.render()
    │       │
    │       ├─► getCursorVisualState(samples, timeMs)
    │       │       │
    │       │       ├─► findLatestInteractionSample()
    │       │       ├─► Calculate clickProgress
    │       │       └─► Return { clickProgress, cursorType }
    │       │
    │       ├─► Check: clickProgress > 0.9?
    │       │       │
    │       │       └─► YES: New click detected
    │       │               │
    │       │               ├─► Get latestClick.timeMs
    │       │               ├─► Compare with lastClickTimeMs
    │       │               │
    │       │               └─► If different:
    │       │                       ├─► soundManager.playClick()
    │       │                       └─► Update lastClickTimeMs
    │       │
    │       └─► Continue rendering cursor
    │
    └─► Next frame
```

### 3. Sound Playback

```
soundManager.playClick()
    │
    ├─► Check: enabled && clickSound loaded?
    │       │
    │       └─► YES: Continue
    │
    ├─► Get next audio element from pool
    │       audioPool[currentIndex]
    │       currentIndex = (currentIndex + 1) % 5
    │
    ├─► Reset audio
    │       audio.currentTime = 0
    │       audio.volume = this.volume (0.3)
    │
    └─► Play audio
            audio.play()
```

## Data Flow

```
Cursor Telemetry Data
    │
    │ [{ timeMs: 1000, x: 0.5, y: 0.5, interactionType: 'click' }, ...]
    │
    ▼
getCursorVisualState()
    │
    │ Finds latest click within clickBounceDuration (350ms)
    │ Calculates clickProgress: 1 - (ageMs / duration)
    │
    ▼
Click Detection Logic
    │
    │ if (clickProgress > 0.9 && newClick)
    │
    ▼
Sound Manager
    │
    │ Plays from audio pool
    │
    ▼
Browser Audio Output
```

## Key Design Decisions

### 1. Audio Pooling
**Why:** Prevents audio clipping when clicks happen rapidly  
**How:** 5 pre-loaded audio elements, rotated in sequence  
**Benefit:** Smooth playback even with double-clicks or rapid clicking

### 2. Click Detection Threshold (0.9)
**Why:** Trigger sound at the start of the click animation  
**How:** clickProgress ranges from 1.0 (start) to 0.0 (end)  
**Benefit:** Sound syncs perfectly with visual click feedback

### 3. Timestamp Tracking
**Why:** Prevent duplicate sounds for the same click  
**How:** Store lastClickTimeMs, compare with current click  
**Benefit:** Each click plays exactly once

### 4. Procedural Sound Generation
**Why:** No external files needed, faster loading  
**How:** Web Audio API generates WAV in memory  
**Benefit:** Smaller bundle size, no network requests

### 5. Singleton Sound Manager
**Why:** Single source of truth for audio state  
**How:** Export single instance, not class  
**Benefit:** Consistent state across all components

## Performance Characteristics

| Aspect | Impact | Notes |
|--------|--------|-------|
| Initialization | ~50ms | One-time cost on mount |
| Memory | ~50KB | 5 audio elements + WAV data |
| CPU per click | <1ms | Simple comparison + play() |
| Audio latency | ~10-20ms | Browser audio pipeline |
| Concurrent clicks | 5 max | Limited by pool size |

## Browser Compatibility

| Feature | API | Support |
|---------|-----|---------|
| Sound generation | OfflineAudioContext | All modern browsers |
| Audio playback | HTMLAudioElement | Universal |
| WAV encoding | DataView | Universal |
| Blob URLs | URL.createObjectURL | Universal |

## Error Handling

```
┌─────────────────────────────────────┐
│ Error Scenarios                     │
├─────────────────────────────────────┤
│ 1. Sound generation fails           │
│    → Log warning, continue silently │
│                                     │
│ 2. Audio play() blocked (autoplay)  │
│    → Catch promise, log debug       │
│                                     │
│ 3. Sound not loaded                 │
│    → Early return, no sound         │
│                                     │
│ 4. Invalid telemetry data           │
│    → No crash, skip sound           │
└─────────────────────────────────────┘
```

## Extension Points

Future enhancements can be added at these points:

1. **Sound Manager** - Add custom sound loading
2. **Click Detection** - Add different sounds per click type
3. **Volume Control** - Add UI slider in settings
4. **Sound Library** - Add multiple sound presets
5. **Spatial Audio** - Add panning based on cursor position
