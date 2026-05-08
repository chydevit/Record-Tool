# Crab Records (Recordly)

Language: English | [Chinese](README.zh-CN.md)

Crab Records is an open-source desktop screen recorder and video editor for polished demos, walkthroughs, tutorials, and short product videos. Record any display or window, jump straight into the editor, add automatic zooms, cursor effects, voice-over narration, webcam overlays, annotations, captions, and styled backgrounds — then export to MP4 or GIF.

<p align="center">
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows%20%7C%20Linux-111827?style=for-the-badge" alt="macOS Windows Linux" />
  <img src="https://img.shields.io/badge/Electron-39-47848f?style=for-the-badge&logo=electron&logoColor=white" alt="Electron 39" />
  <img src="https://img.shields.io/badge/license-AGPL--3.0-2563eb?style=for-the-badge" alt="AGPL 3.0 license" />
  <img src="https://img.shields.io/github/v/release/chydevit/Record-Tool?style=for-the-badge&color=22c55e" alt="Latest release" />
</p>

---

## Table of Contents

- [Features](#features)
- [Platform Support](#platform-support)
- [Download & Install](#download--install)
  - [Windows (.exe)](#windows-exe)
  - [macOS (.dmg)](#macos-dmg)
  - [Linux (.AppImage)](#linux-appimage)
- [How to Use](#how-to-use)
  - [1. Record Your Screen](#1-record-your-screen)
  - [2. Edit Your Recording](#2-edit-your-recording)
  - [3. Auto Edit (Smart Zoom)](#3-auto-edit-smart-zoom)
  - [4. Add Voice-Over](#4-add-voice-over)
  - [5. Export](#5-export)
- [Troubleshooting](#troubleshooting)
  - [App won't open / crashes on launch](#app-wont-open--crashes-on-launch)
  - [Recording doesn't start](#recording-doesnt-start)
  - [No audio in recording](#no-audio-in-recording)
  - [Windows SmartScreen warning](#windows-smartscreen-warning)
  - [Black or blank recording](#black-or-blank-recording)
  - [Export fails or freezes](#export-fails-or-freezes)
  - [Auto Edit produces no zooms](#auto-edit-produces-no-zooms)
  - [Webcam not detected](#webcam-not-detected)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Screenshots

<p align="center">
  <img src="screenshots/recordly-ui.png" alt="Recordly User Interface" width="800" />
</p>

*Recordly's comprehensive recording interface with Quick Actions, Device Controls, Utilities, Recording Control, and Window Controls*

<p align="center">
  <img src="screenshots/recordly-review-feature.png" alt="Recordly Review Feature Interface" width="800" />
</p>

*Detailed view of Recordly's powerful tools including Screenshot, Spotlight, Focus Mode, Webcam, Cursor Effects, Drawing Tools, Keyboard shortcuts, Background Blur, and Smart Options for quality control*

---

## Features

- **Screen & window recording** with platform-native capture helpers (WGC on Windows, ScreenCaptureKit on macOS).
- **Microphone & system audio** capture with per-device selection and gain control.
- **Auto Edit** — one-click automatic zoom region generation based on cursor telemetry.
- **Voice-Over** — record narration directly inside the editor without re-recording the screen.
- **Timeline editing** — trim, cut, add zoom regions, speed regions, annotations, and extra audio tracks.
- **Cursor controls** — size, smoothing, motion blur, click bounce, sway, looped motion, and rendered cursor styles.
- **Webcam bubble overlays** with mirroring, sizing, placement, roundness, shadows, and zoom-reactive scaling.
- **Styled frames** — wallpapers, custom images, solid colors, gradients, blur, shadows, padding, corners, and aspect-ratio presets.
- **Auto-captions** through Whisper with bundled or user-selected runtime.
- **Project saving** — save and reopen sessions as `.recordly` files.
- **MP4 & GIF export** with quality, size, frame-rate, and looping controls.
- **Localized UI** — English, Chinese, Spanish, and Khmer.

---

## Platform Support

| Platform | Minimum | Notes |
| --- | --- | --- |
| **macOS** | 12.3 Monterey | Uses ScreenCaptureKit native helpers. Screen recording, microphone, camera, and accessibility permissions may be required. |
| **Windows** | Windows 10 20H1 (build 19041) | Uses Windows Graphics Capture and WASAPI helpers. Older builds fall back to Electron capture. |
| **Linux** | Modern desktop distro | Uses Electron capture APIs. System audio usually depends on PipeWire. Cursor hiding is not supported. |

---

## Download & Install

Download the latest release from the **[Releases page](https://github.com/chydevit/Record-Tool/releases)**.

### Windows (.exe)

1. Go to the [Releases page](https://github.com/chydevit/Record-Tool/releases).
2. Under the latest release, find and download **`Crab-Records-windows-x64.exe`**.
3. Double-click the downloaded `.exe` file.
4. If Windows shows a **SmartScreen** warning, click **More info → Run anyway** (see [SmartScreen fix](#windows-smartscreen-warning)).
5. Follow the installer — it installs to `%LocalAppData%\Programs\Crab Records` by default.
6. Launch **Crab Records** from the Start menu or the desktop shortcut.
7. On first launch, grant the permissions the app requests (microphone, camera, screen capture).

> **To uninstall:** Open **Settings → Apps → Installed apps**, find **Crab Records**, and click **Uninstall**.

### macOS (.dmg)

1. Download **`Crab-Records-arm64.dmg`** (Apple Silicon) or **`Crab-Records-x64.dmg`** (Intel).
2. Open the `.dmg` file and drag **Crab Records** to your **Applications** folder.
3. On first launch macOS may quarantine the app. If it won't open, run in Terminal:
   ```bash
   xattr -rd com.apple.quarantine /Applications/Crab\ Records.app
   ```
4. Grant Screen Recording, Microphone, and Camera permissions when prompted in **System Settings → Privacy & Security**.

### Linux (.AppImage)

1. Download **`Crab-Records-linux-x64.AppImage`**.
2. Make it executable:
   ```bash
   chmod +x Crab-Records-linux-x64.AppImage
   ```
3. Run it:
   ```bash
   ./Crab-Records-linux-x64.AppImage
   ```
4. For system audio, ensure **PipeWire** is running on your distro.

---

## How to Use

### 1. Record Your Screen

1. Launch **Crab Records**. The **Launch UI** (small floating bar) appears.
2. Click the **screen/window selector** to choose what to capture — a full display or a specific app window.
3. (Optional) Toggle **Microphone** on/off and choose your mic device from the dropdown.
4. (Optional) Toggle **System Audio** to capture desktop audio.
5. (Optional) Toggle **Webcam** to add a webcam bubble overlay.
6. (Optional) Set a **Countdown** timer (3 s, 5 s, or 10 s) so you have time to switch to your target window.
7. Click **Record** (the red button). Recording starts after the countdown.
8. Perform your workflow on screen. Click **Stop** in the floating bar when done.

> **Tip — Hide Desktop:** Toggle **Hide Desktop** in the Launch UI to hide your desktop icons while recording.

---

### 2. Edit Your Recording

After stopping, the editor opens automatically with your clip on the timeline.

| Area | What you can do |
|------|----------------|
| **Timeline** | Drag the playhead, drag clip edges to trim, right-click clips for cut/delete |
| **Zoom Regions** | Drag the zoom bar above the timeline to add a zoom-in region |
| **Cursor Effects** | Left panel → Cursor tab — size, smoothing, blur, bounce, sway, loops |
| **Frame / Background** | Left panel → Frame tab — pick wallpaper, color, gradient, or custom image |
| **Webcam Overlay** | Left panel → Webcam tab — resize, reposition, round corners, add shadow |
| **Annotations** | Click the **Annotate** button in the toolbar — draw arrows, shapes, or text |
| **Captions** | Left panel → Captions tab — generate via Whisper or type manually |
| **Speed Regions** | Right-click on the timeline → Add Speed Region |

Use **Ctrl+Z / Cmd+Z** to undo and **Ctrl+Y / Cmd+Y** to redo.

---

### 3. Auto Edit (Smart Zoom)

Auto Edit analyses your cursor movement telemetry and automatically inserts zoom regions where the action happened — great for long recordings where you want effortless zoom-in highlights.

1. Open a recording in the editor.
2. Click the **Auto Edit** button in the top toolbar (wand icon).
3. Wait a moment — zoom regions are inserted into the timeline automatically.
4. Review the generated zooms by playing back the timeline.
5. Drag zoom region edges to adjust timing, or delete any you don't want.

> **Tip:** Enable the **Zoom Switch** in the Launch UI before recording to make Auto Edit more accurate — it uses live cursor telemetry rather than post-recording inference.

---

### 4. Add Voice-Over

Record narration on top of your existing screen recording without re-recording the screen.

1. In the editor, click the **Voice-Over** button (microphone icon) in the toolbar.
2. Choose your **microphone** from the device list.
3. Position the timeline playhead where you want narration to start.
4. Click **Record** — narration records while the video plays back.
5. Click **Stop** to finish. The voice-over track appears in the timeline.
6. Drag the audio clip to reposition it, or trim its edges.

---

### 5. Export

1. Click the **Export** button (top-right of the editor).
2. Choose format: **MP4** or **GIF**.
3. Adjust quality, resolution, and frame rate if needed.
4. Click **Save** and choose an output location.
5. Wait for the export progress bar to complete. The file is saved to your chosen location.

> **Save project:** To save your edit for later, click **File → Save** (or press **Ctrl+S**) to write a `.recordly` project file. Reopen it any time to continue editing.

---

## Troubleshooting

### App won't open / crashes on launch

| Check | Fix |
|-------|-----|
| **Windows version too old** | Requires Windows 10 20H1 (build 19041) or newer. Update Windows. |
| **Antivirus blocked the app** | Check antivirus quarantine/exclusions and allow `CrabRecords.exe` and its helper files. |
| **Corrupted install** | Uninstall via Settings → Apps, then reinstall from the [latest release](https://github.com/chydevit/Record-Tool/releases). |
| **macOS Gatekeeper block** | Run `xattr -rd com.apple.quarantine /Applications/Crab\ Records.app` in Terminal. |
| **Missing Visual C++ runtime (Windows)** | Install [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe). |

---

### Recording doesn't start

| Check | Fix |
|-------|-----|
| **No screen selected** | Click the source selector and choose a display or window. |
| **Screen Recording permission denied (macOS)** | Go to **System Settings → Privacy & Security → Screen Recording** and enable Crab Records. Restart the app. |
| **Capture permission denied (Windows)** | When Windows asks for capture access, click **Allow**. If you missed it, restart the app — it will ask again. |
| **Window is minimized** | Restore the window you want to record before starting. |
| **App running as Admin blocks capture** | Run the app without administrator privileges. |

---

### No audio in recording

| Check | Fix |
|-------|-----|
| **Microphone not toggled on** | Toggle the mic switch ON in the Launch UI before starting. |
| **Wrong mic device selected** | Click the mic dropdown and select your correct device. |
| **System audio off** | Toggle **System Audio** ON in the Launch UI. |
| **Microphone permission denied (macOS)** | **System Settings → Privacy & Security → Microphone** → enable Crab Records. |
| **Microphone permission denied (Windows)** | **Settings → Privacy & Security → Microphone** → allow desktop apps to access the mic. |
| **Linux — no system audio** | Ensure PipeWire is running: `systemctl --user status pipewire`. |

---

### Windows SmartScreen warning

Unsigned or newly published builds trigger Microsoft Defender SmartScreen.

**To bypass:**
1. Click **More info** on the SmartScreen dialog.
2. Click **Run anyway**.

This is expected for unsigned community builds. The app is open source — you can review the code or build it yourself.

---

### Black or blank recording

| Check | Fix |
|-------|-----|
| **GPU acceleration conflict** | Start the app, go to settings, and disable hardware acceleration. Restart and try again. |
| **Protected content / DRM window** | Some apps (Netflix, etc.) block capture by design. Switch to a different window. |
| **Wrong capture API (Windows)** | If WGC capture shows black, try switching to the window-specific capture source. |
| **Second monitor at different scale (Windows)** | Try recording on your primary monitor first. |

---

### Export fails or freezes

| Check | Fix |
|-------|-----|
| **Not enough disk space** | Ensure you have at least 2 GB free on the export destination drive. |
| **Output path has special characters** | Choose an export folder with a plain path (no emoji, brackets, or non-ASCII characters). |
| **Very long recording** | For recordings over 30 min, lower the export resolution or split into segments. |
| **Codec not supported** | Try switching to H.264 (MP4) if H.265 export fails on your system. |
| **App froze mid-export** | Force-quit and reopen. The `.recordly` project is preserved — reopen it and try exporting again. |

---

### Auto Edit produces no zooms

| Check | Fix |
|-------|-----|
| **Cursor telemetry not recorded** | Auto Edit needs cursor movement data captured during recording. Make sure the recording was made with Crab Records (not imported externally). |
| **Cursor was barely moved** | Auto Edit looks for significant cursor movement. Recordings with very little cursor activity may produce few or no zoom suggestions. |
| **Zoom Switch was off** | Enable the **Zoom Switch** in the Launch UI before your next recording for better results. |

---

### Webcam not detected

| Check | Fix |
|-------|-----|
| **Camera permission denied** | macOS: **System Settings → Privacy → Camera**. Windows: **Settings → Privacy → Camera** → allow desktop apps. |
| **Another app using the camera** | Close any other app that might be using the webcam (Zoom, Teams, OBS, etc.). |
| **USB camera not recognized** | Unplug and re-plug the camera, then restart Crab Records. |

---

## Development

**Requirements:** Node.js 20+, npm, Git, and platform build tools for native helpers.

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linter and tests
npm run lint
npm test

# Build for current platform
npm run build

# Build for a specific platform
npm run build:win    # Windows NSIS installer
npm run build:mac    # macOS DMG + ZIP
npm run build:linux  # Linux AppImage
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development guide and [RELEASING.md](RELEASING.md) for the release process.

---

## Contributing

Focused pull requests are welcome. Useful areas: Linux capture, export stability, native helper reliability, localization, and editor workflow improvements.

Before opening a PR: run the relevant checks, test the recording/editing/export path your change touches, and keep unrelated refactors out of the PR.

---

## Credits

Recordly originally started as a fork of [OpenScreen](https://github.com/siddharthvaddem/openscreen) and has since been substantially changed.

---

## License

This project is licensed under the [AGPL 3.0](LICENSE.md).
