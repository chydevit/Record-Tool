# Sound System Visual Guide

## 🎵 Sound Waveform Characteristics

### 1. Default Click
```
Frequency: 1200Hz → 800Hz
Duration:  100ms
Volume:    0.30

Waveform:
    ╱╲
   ╱  ╲___
  ╱       ╲___
 ╱            ╲___
╱                 ╲___
0ms              100ms
```

### 2. Double-Click
```
Frequency: 1300Hz → 900Hz, then 1400Hz → 1000Hz
Duration:  250ms
Volume:    0.35, 0.40

Waveform:
    ╱╲         ╱╲
   ╱  ╲___    ╱  ╲___
  ╱       ╲  ╱       ╲
 ╱         ╲╱         ╲___
╱                         ╲___
0ms    80ms  150ms      250ms
```

### 3. Right-Click
```
Frequency: 800Hz → 500Hz
Duration:  120ms
Volume:    0.35

Waveform:
      ╱╲
     ╱  ╲
    ╱    ╲___
   ╱         ╲___
  ╱              ╲___
 ╱                   ╲___
╱                        ╲___
0ms                    120ms
```

### 4. Soft Click
```
Frequency: 1000Hz → 700Hz
Duration:  80ms
Volume:    0.20

Waveform:
   ╱╲
  ╱  ╲___
 ╱       ╲___
╱            ╲___
0ms         80ms
```

### 5. Mechanical Click
```
Frequency: 1500Hz → 1000Hz (square wave)
Duration:  60ms
Volume:    0.25

Waveform:
┌─┐
│ │┌─┐
│ ││ │┌─┐
│ ││ ││ │___
└─┘└─┘└─┘
0ms    60ms
```

### 6. Pop Sound
```
Frequency: 2000Hz → 400Hz
Duration:  150ms
Volume:    0.40

Waveform:
╱╲
│ ╲
│  ╲
│   ╲___
│       ╲___
│           ╲___
│               ╲___
└───────────────────╲___
0ms               150ms
```

## 🎼 Sound Comparison Chart

```
Volume (0.0 - 1.0)
1.0 ┤                                    ● Pop
    │                                   ╱│╲
0.8 ┤                                  ╱ │ ╲
    │                                 ╱  │  ╲
0.6 ┤                                ╱   │   ╲
    │                               ╱    │    ╲
0.4 ┤        ● Double-Click        ╱     │     ╲
    │       ╱│╲  ╱│╲              ╱      │      ╲
0.3 ┤  ● Default  ● Right-Click  ╱       │       ╲
    │ ╱│╲  ╱│╲   ╱│╲            ╱        │        ╲
0.2 ┤╱ │ ╲╱ │ ╲ ╱ │ ╲  ● Soft ╱         │         ╲
    │  │   │  │   │  ╲ ╱│╲   ╱          │          ╲
0.1 ┤  │   │  │   │   ╲╱ │ ╲╱   ● Mech  │           ╲
    │  │   │  │   │      │     ╱│╲      │            ╲
0.0 ┴──┴───┴──┴───┴──────┴────┴─┴──────┴─────────────┴─
    0  50 100 150 200   250   300     350           500ms
```

## 🎯 Sound Selection Flow

```
┌─────────────────────────────────────────────────────┐
│           Cursor Interaction Detected                │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Get Interaction│
         │      Type      │
         └────────┬───────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   ┌─────────┐         ┌─────────┐
   │ Special │         │ Regular │
   │  Type?  │         │  Click  │
   └────┬────┘         └────┬────┘
        │                   │
   ┌────┴────┐              │
   │         │              │
   ▼         ▼              ▼
┌──────┐ ┌──────┐    ┌──────────┐
│Double│ │Right │    │  Check   │
│Click │ │Click │    │ Variant  │
└──┬───┘ └──┬───┘    └────┬─────┘
   │        │             │
   │        │      ┌──────┴──────┐
   │        │      │             │
   │        │      ▼             ▼
   │        │  ┌────────┐   ┌────────┐
   │        │  │Default │   │Variant │
   │        │  └───┬────┘   └───┬────┘
   │        │      │            │
   │        │      │     ┌──────┴──────┐
   │        │      │     │             │
   │        │      │     ▼             ▼
   │        │      │  ┌──────┐    ┌──────┐
   │        │      │  │ Soft │    │ Mech │
   │        │      │  └──────┘    └──┬───┘
   │        │      │                  │
   │        │      │                  ▼
   │        │      │              ┌──────┐
   │        │      │              │ Pop  │
   │        │      │              └──┬───┘
   │        │      │                 │
   └────────┴──────┴─────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │  Play Sound    │
          │  from Pool     │
          └────────────────┘
```

## 🎨 Sound Characteristics Matrix

```
┌──────────────┬──────────┬──────────┬─────────┬────────────┐
│ Sound Type   │ Pitch    │ Duration │ Volume  │ Character  │
├──────────────┼──────────┼──────────┼─────────┼────────────┤
│ Default      │ High     │ Medium   │ Medium  │ Neutral    │
│ Double-Click │ High     │ Long     │ High    │ Energetic  │
│ Right-Click  │ Low      │ Medium   │ High    │ Substantial│
│ Soft         │ Medium   │ Short    │ Low     │ Gentle     │
│ Mechanical   │ High     │ Short    │ Medium  │ Sharp      │
│ Pop          │ Very High│ Long     │ High    │ Playful    │
└──────────────┴──────────┴──────────┴─────────┴────────────┘
```

## 🔊 Volume Levels Visualization

```
100% ┤                                    ████ Pop
     │                                    ████
 80% ┤                                    ████
     │                                    ████
 60% ┤                                    ████
     │                                    ████
 40% ┤        ████ Double    ████ Right  ████
     │        ████ Click     ████ Click  ████
 30% ┤  ████  ████           ████        ████
     │  ████  ████           ████        ████
 20% ┤  ████  ████  ████     ████  ████  ████
     │  ████  ████  ████ Soft████  ████  ████
 10% ┤  ████  ████  ████     ████  ████  ████
     │  ████  ████  ████     ████  ████  ████
  0% ┴──────────────────────────────────────────
     Default Double Right  Soft  Mech   Pop
```

## ⏱️ Duration Comparison

```
250ms ┤                    ████████████ Double-Click
      │                    ████████████
200ms ┤                    ████████████
      │                    ████████████
150ms ┤                    ████████████  ████████ Pop
      │                    ████████████  ████████
120ms ┤                    ████████████  ████████  ██████ Right
      │                    ████████████  ████████  ██████
100ms ┤  █████ Default     ████████████  ████████  ██████
      │  █████             ████████████  ████████  ██████
 80ms ┤  █████  ████ Soft  ████████████  ████████  ██████
      │  █████  ████       ████████████  ████████  ██████
 60ms ┤  █████  ████       ████████████  ████████  ██████  ███ Mech
      │  █████  ████       ████████████  ████████  ██████  ███
  0ms ┴────────────────────────────────────────────────────────
      Default Soft        Double        Pop       Right  Mech
```

## 🎵 Frequency Range Visualization

```
2000Hz ┤                                              ● Pop (start)
       │                                             ╱
1800Hz ┤                                            ╱
       │                                           ╱
1600Hz ┤                                          ╱
       │                                         ╱
1400Hz ┤                          ● Double-2    ╱
       │                         ╱             ╱
1200Hz ┤  ● Default (start)     ╱             ╱
       │ ╱                     ╱             ╱
1000Hz ┤╱                     ●             ╱
       │                                   ╱
 800Hz ┤● Default (end)  ● Right (start) ╱
       │                ╱               ╱
 600Hz ┤               ╱               ╱
       │              ╱               ╱
 400Hz ┤             ╱               ● Pop (end)
       │            ╱
 200Hz ┤           ╱
       │          ●
   0Hz ┴──────────────────────────────────────
       0ms                              150ms
```

## 🎮 Console Command Tree

```
quickTests
├── all()           → Test all sounds in sequence
├── click()         → Play default/variant click
├── double()        → Play double-click
├── right()         → Play right-click
├── variants()      → Test all variants
├── variant(type)   → Set variant
│   ├── 'default'
│   ├── 'soft'
│   ├── 'mechanical'
│   └── 'pop'
├── volumes()       → Test volume levels
├── volume(level)   → Set volume (0.0-1.0)
├── rapid()         → Test rapid clicks
├── interactions()  → Test interaction types
├── toggle()        → Toggle enabled state
└── config()        → Show configuration

soundManager
├── playClick()
├── playDoubleClick()
├── playRightClick()
├── playMiddleClick()
├── playInteraction(type)
├── setClickSoundVariant(variant)
├── getClickSoundVariant()
├── setVolume(level)
├── getVolume()
├── setEnabled(state)
├── isEnabled()
└── loadAllSounds(sounds)

soundTester
├── initialize()
├── testAllSounds()
├── testRapidClicks(count, interval)
├── testAllVariants()
├── testVolumeLevels()
├── testInteractionTypes()
├── getStats()
└── printConfig()
```

## 📊 Performance Metrics

```
Initialization Time
300ms ┤████████████████████████████████
      │████████████████████████████████
250ms ┤████████████████████████████████
      │████████████████████████████████
200ms ┤████████████████████████████████
      │████████████████████████████████
150ms ┤████████████████████████████████
      │████████████████████████████████
100ms ┤████████████████████████████████
      │████████████████████████████████
 50ms ┤████████████████████████████████
      │████████████████████████████████
  0ms ┴────────────────────────────────
      All Sounds (parallel generation)

Playback Latency
 5ms ┤
     │
 4ms ┤
     │
 3ms ┤
     │
 2ms ┤
     │
 1ms ┤█ <-- Typical latency
     │█
 0ms ┴─────────────────────────────────
     Click Sound Playback

Memory Usage
150KB ┤
      │
120KB ┤████████████████████ Total
      │████████████████████
100KB ┤████████████████████
      │████████████████████
 50KB ┤████████████████████
      │████████████████████
  0KB ┴────────────────────────────────
      Sound System Memory
```

## 🎯 Use Case Recommendations

```
┌─────────────────────┬──────────────────────────┐
│ Use Case            │ Recommended Sound        │
├─────────────────────┼──────────────────────────┤
│ Professional Demo   │ Default                  │
│ Tutorial Video      │ Soft                     │
│ Gaming Content      │ Mechanical               │
│ Fun/Casual Content  │ Pop                      │
│ Technical Demo      │ Mechanical               │
│ UI/UX Showcase      │ Default or Soft          │
└─────────────────────┴──────────────────────────┘
```

## 🔄 Sound Pool Rotation

```
Pool for "Click" Sound (5 elements)

Initial State:
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└─▲─┴───┴───┴───┴───┘
  │
  Current Index

After 1st Click:
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└───┴─▲─┴───┴───┴───┘
      │
      Current Index

After 5th Click:
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└───┴───┴───┴───┴─▲─┘
                  │
                  Current Index

After 6th Click (wraps around):
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└─▲─┴───┴───┴───┴───┘
  │
  Current Index
```

This allows up to 5 overlapping sounds without clipping!
