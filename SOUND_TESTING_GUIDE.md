# Sound Testing Guide

## Quick Start

Once the app is running, open the browser console and try these commands:

### Test All Sounds
```javascript
quickTests.all()
```
Plays all 6 sound types in sequence with labels.

### Test Individual Sounds
```javascript
quickTests.click()      // Default click
quickTests.double()     // Double-click
quickTests.right()      // Right-click
```

### Test Sound Variants
```javascript
quickTests.variants()   // Test all variants in sequence

// Or set a specific variant
quickTests.variant('soft')
quickTests.variant('mechanical')
quickTests.variant('pop')
quickTests.variant('default')
```

### Test Volume Levels
```javascript
quickTests.volumes()    // Test all volume levels

// Or set specific volume
quickTests.volume(0.5)  // 50%
quickTests.volume(1.0)  // 100%
```

### Test Rapid Clicks
```javascript
quickTests.rapid()      // 10 clicks at 100ms intervals
```

### Test Interaction Types
```javascript
quickTests.interactions()  // Test all interaction types
```

### Toggle Sounds On/Off
```javascript
quickTests.toggle()     // Toggle enabled state
```

### Show Current Configuration
```javascript
quickTests.config()     // Display current settings
```

## Advanced Testing

### Using Sound Manager Directly

```javascript
// Access sound manager
soundManager.setVolume(0.7)
soundManager.setEnabled(true)
soundManager.setClickSoundVariant('mechanical')

// Play specific sounds
soundManager.playClick()
soundManager.playDoubleClick()
soundManager.playRightClick()
soundManager.playInteraction('double-click')

// Check status
soundManager.isEnabled()
soundManager.getVolume()
soundManager.getClickSoundVariant()
```

### Using Sound Tester

```javascript
// Initialize sounds
await soundTester.initialize()

// Run tests
await soundTester.testAllSounds()
await soundTester.testRapidClicks(20, 50)  // 20 clicks, 50ms apart
await soundTester.testAllVariants()
await soundTester.testVolumeLevels()
await soundTester.testInteractionTypes()

// Get statistics
soundTester.getStats()
soundTester.printConfig()
```

## Testing Scenarios

### Scenario 1: Compare All Sound Variants

```javascript
// Play default
quickTests.variant('default')
quickTests.click()

// Wait 1 second, then play soft
setTimeout(() => {
  quickTests.variant('soft')
  quickTests.click()
}, 1000)

// Wait 2 seconds, then play mechanical
setTimeout(() => {
  quickTests.variant('mechanical')
  quickTests.click()
}, 2000)

// Wait 3 seconds, then play pop
setTimeout(() => {
  quickTests.variant('pop')
  quickTests.click()
}, 3000)
```

### Scenario 2: Test Click Types

```javascript
// Regular click
quickTests.click()

// Wait, then double-click
setTimeout(() => quickTests.double(), 500)

// Wait, then right-click
setTimeout(() => quickTests.right(), 1000)
```

### Scenario 3: Volume Comparison

```javascript
// Quiet
quickTests.volume(0.1)
quickTests.click()

// Medium
setTimeout(() => {
  quickTests.volume(0.5)
  quickTests.click()
}, 500)

// Loud
setTimeout(() => {
  quickTests.volume(1.0)
  quickTests.click()
}, 1000)
```

### Scenario 4: Stress Test

```javascript
// Test audio pool with rapid clicks
for (let i = 0; i < 20; i++) {
  setTimeout(() => quickTests.click(), i * 50)
}
```

### Scenario 5: All Sounds Demo

```javascript
// Complete demo of all features
async function fullDemo() {
  console.log('🎵 Starting full sound demo...')
  
  // Test all sound types
  await quickTests.all()
  
  // Wait 4 seconds
  await new Promise(resolve => setTimeout(resolve, 4000))
  
  // Test all variants
  await quickTests.variants()
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Test rapid clicks
  await quickTests.rapid()
  
  console.log('✅ Full demo complete!')
}

fullDemo()
```

## Console Commands Reference

| Command | Description |
|---------|-------------|
| `quickTests.all()` | Test all sound types |
| `quickTests.click()` | Play single click |
| `quickTests.double()` | Play double-click |
| `quickTests.right()` | Play right-click |
| `quickTests.variants()` | Test all variants |
| `quickTests.variant('soft')` | Set variant |
| `quickTests.volumes()` | Test volume levels |
| `quickTests.volume(0.5)` | Set volume |
| `quickTests.rapid()` | Test rapid clicks |
| `quickTests.interactions()` | Test interaction types |
| `quickTests.toggle()` | Toggle on/off |
| `quickTests.config()` | Show configuration |

## Debugging

### Check if sounds are loaded

```javascript
soundTester.getStats()
// Should show: { initialized: true, enabled: true, volume: 0.3, variant: 'default' }
```

### Check sound manager state

```javascript
soundManager.isEnabled()  // Should be true
soundManager.getVolume()  // Should be 0.3 (default)
soundManager.getClickSoundVariant()  // Should be 'default'
```

### Reinitialize sounds

```javascript
await soundTester.initialize()
```

### Test if audio is working

```javascript
// Create a simple test tone
const audio = new Audio()
audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
audio.play()
```

## Performance Testing

### Measure initialization time

```javascript
console.time('sound-init')
await soundTester.initialize()
console.timeEnd('sound-init')
// Should be ~300ms
```

### Measure playback latency

```javascript
console.time('click-latency')
quickTests.click()
console.timeEnd('click-latency')
// Should be <1ms
```

### Test concurrent sounds

```javascript
// Play 10 sounds simultaneously
for (let i = 0; i < 10; i++) {
  quickTests.click()
}
// Should hear overlapping clicks without clipping
```

## Troubleshooting

### No sound playing

1. Check if enabled:
```javascript
soundManager.isEnabled()  // Should be true
```

2. Check volume:
```javascript
soundManager.getVolume()  // Should be > 0
```

3. Check browser audio:
```javascript
// Try playing a test tone
new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play()
```

4. Check console for errors:
```javascript
// Look for error messages in console
```

### Sounds cutting off

1. Increase pool size (in soundManager.ts):
```typescript
private poolSize = 10;  // Increase from 5
```

2. Check for rapid clicks:
```javascript
// Test with slower interval
quickTests.testRapidClicks(10, 200)  // 200ms instead of 100ms
```

### Wrong sound playing

1. Check variant:
```javascript
soundManager.getClickSoundVariant()
```

2. Reset to default:
```javascript
quickTests.variant('default')
```

## Integration Testing

### Test with actual video playback

1. Load a video with cursor recording
2. Enable cursor display
3. Play the video
4. Listen for click sounds at cursor click events
5. Try different variants:
```javascript
quickTests.variant('mechanical')
```

### Test with different click types

1. Record a video with:
   - Regular clicks
   - Double-clicks
   - Right-clicks
2. Play back and verify correct sounds

## Automated Testing

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { soundManager } from '@/lib/soundManager'

describe('Sound Manager', () => {
  it('should play different sounds for different interactions', () => {
    const playSpy = vi.spyOn(soundManager, 'playInteraction')
    
    soundManager.playInteraction('click')
    soundManager.playInteraction('double-click')
    soundManager.playInteraction('right-click')
    
    expect(playSpy).toHaveBeenCalledTimes(3)
  })
})
```

## Tips

1. **Use headphones** for better sound quality testing
2. **Test at different volumes** to ensure sounds are pleasant at all levels
3. **Test rapid clicks** to verify audio pool is working
4. **Compare variants** to find your preferred sound
5. **Test with actual videos** to verify timing and synchronization

## Keyboard Shortcuts (Future Enhancement)

Suggested shortcuts for quick testing:
- `Ctrl+Shift+1` - Test all sounds
- `Ctrl+Shift+2` - Cycle through variants
- `Ctrl+Shift+3` - Toggle sounds on/off
- `Ctrl+Shift+↑` - Increase volume
- `Ctrl+Shift+↓` - Decrease volume
