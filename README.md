# Crab Records (Recordly)

Language: English | [Chinese](README.zh-CN.md)

Crab Records, originally Recordly, is an open-source desktop screen recorder and editor for polished demos, walkthroughs, tutorials, and short product videos. Record a display or window, jump straight into the editor, add zooms, cursor effects, webcam overlays, annotations, captions, and styled backgrounds, then export to MP4 or GIF.

<p align="center">
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows%20%7C%20Linux-111827?style=for-the-badge" alt="macOS Windows Linux" />
  <img src="https://img.shields.io/badge/Electron-39-47848f?style=for-the-badge&logo=electron&logoColor=white" alt="Electron 39" />
  <img src="https://img.shields.io/badge/license-AGPL--3.0-2563eb?style=for-the-badge" alt="AGPL 3.0 license" />
</p>

## Features

- Screen and window recording with platform-native helpers where available.
- Microphone and system audio capture.
- Timeline editing for trims, zoom regions, speed regions, annotations, and extra audio.
- Cursor controls for size, smoothing, motion blur, click bounce, sway, looped motion, and rendered cursor styles.
- Automatic zoom suggestions from cursor telemetry.
- Webcam bubble overlays with mirroring, sizing, placement, roundness, shadows, and zoom-reactive scaling.
- Styled frames with wallpapers, custom images, solid colors, gradients, blur, shadows, padding, corners, and aspect-ratio presets.
- Auto-captions through Whisper with bundled or user-selected Whisper runtime support.
- Project saving and reopening through `.recordly` files.
- MP4 and GIF export with quality, size, frame-rate, and looping controls.
- Localized UI strings for English, Chinese, Spanish, and Khmer.

## Platform Support

| Platform | Minimum | Notes |
| --- | --- | --- |
| macOS | 12.3 Monterey | Uses ScreenCaptureKit-based native helpers. Screen recording, microphone, camera, and accessibility permissions may be required. |
| Windows | Windows 10 20H1, build 19041 | Uses Windows Graphics Capture and WASAPI helpers where available. Older builds may fall back to Electron capture. |
| Linux | Modern desktop distro | Uses Electron capture APIs. System audio usually depends on PipeWire. Cursor hiding is not supported today. |

## Download

Packaged builds are published through GitHub Releases when release automation is run:

```text
https://github.com/chydevit/Record-Tool/releases
```

The upstream Recordly release configuration may still reference the original project owner in some build metadata. Check `electron-builder.json5` and `.github/workflows/release.yml` before publishing releases from a fork.

## Install on Windows from the EXE

Use the Windows `.exe` installer when you want to install Crab Records as a normal desktop app.

1. Open the [Releases page](https://github.com/chydevit/Record-Tool/releases).
2. Choose the latest release.
3. Download the Windows installer asset. It is usually named like `Crab-Records-windows-x64.exe`.
4. Double-click the downloaded `.exe` file.
5. Follow the installer prompts.
6. Launch Crab Records from the Start menu or desktop shortcut.

Windows may show a Microsoft Defender SmartScreen warning for unsigned or newly published builds. If you trust the release source, click **More info**, then **Run anyway**.

On first launch, allow the permissions needed for your recording workflow:

- Microphone access if you want voice recording.
- Camera access if you want webcam overlay recording.
- Screen/window capture prompts when Windows asks for capture access.
- System audio access when using the built-in audio recording path.

If recording does not start correctly after installation:

- Restart the app after granting permissions.
- Make sure you are using Windows 10 20H1 build 19041 or newer.
- Try recording a visible, non-minimized window.
- Reinstall from the latest release if the installer was interrupted.
- Check that antivirus software has not quarantined the app or its native helper files.

To uninstall the app, open **Settings > Apps > Installed apps**, find **Crab Records**, and choose **Uninstall**.

### Build the Windows EXE locally

Developers can build a local Windows installer with:

```bash
npm install
npm run build:win
```

The generated installer is written to the `release/` directory. Windows helper builds require Visual Studio C++ build tools and CMake. If CMake is missing, the optional bundled Whisper runtime is skipped unless `RECORDLY_REQUIRE_BUNDLED_WHISPER_RUNTIME=1` is set.

## Development

Requirements:

- Node.js 20 or newer.
- npm.
- Git.
- Platform build tools if you need native helpers or packaged builds.

Install dependencies and run the app in development mode:

```bash
npm install
npm run dev
```

Run checks:

```bash
npm run lint
npm test
npm run i18n:check
```

Build a packaged app for the current platform:

```bash
npm run build
```

Targeted package builds:

```bash
npm run build:mac
npm run build:win
npm run build:linux
```

## Native Helpers

The app includes native helpers for capture, cursor telemetry, cursor hiding, and optional Whisper runtime packaging.

Useful scripts:

| Script | Purpose |
| --- | --- |
| `npm run build:native-helpers` | Builds macOS native helper binaries. |
| `npm run build:windows-capture` | Builds the Windows Graphics Capture helper. |
| `npm run build:cursor-monitor` | Builds the Windows cursor monitor helper. |
| `npm run build:whisper-runtime` | Builds and stages the optional bundled Whisper CLI runtime. |
| `npm run build:platform-native-helpers` | Runs the platform helper build sequence used before packaged builds. |

On Windows, native helper builds require Visual Studio C++ build tools and CMake. The Whisper runtime is optional by default: if CMake is missing, the build script skips the bundled runtime and the app can still use a user-selected or system Whisper executable. Set `RECORDLY_REQUIRE_BUNDLED_WHISPER_RUNTIME=1` to make a missing bundled Whisper runtime fail the build.

## Project Structure

```text
electron/       Electron main process, preload bridge, native helper integration
src/            React renderer UI, editor, timeline, export, and i18n code
scripts/        Build, native helper, i18n, and release utility scripts
public/         Runtime static assets, including wallpapers
icons/          App icons
build/          Packaging entitlements and build resources
.github/        CI and release workflows
release/        electron-builder output directory
```

## Recording Workflow

1. Launch the app.
2. Choose a display or window source.
3. Configure microphone, system audio, and recording preferences.
4. Record the clip.
5. Stop recording to open the editor.
6. Add trims, zooms, annotations, captions, webcam overlays, and frame styling.
7. Export as MP4 or GIF, or save the session as a `.recordly` project.

## macOS Quarantine Note

Locally built macOS apps may be blocked by Gatekeeper. If you trust your local build, remove the quarantine flag:

```bash
xattr -rd com.apple.quarantine /Applications/Crab\ Records.app
```

## Contributing

Focused pull requests are welcome. Useful areas include Linux capture behavior, export stability, native helper reliability, localization, and editor workflow improvements.

Before opening a PR:

- Run the relevant checks and tests.
- Exercise the recording, editing, and export path affected by your change.
- Keep unrelated refactors out of the PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Release Notes

Release automation is documented in [RELEASING.md](RELEASING.md). It covers GitHub Releases, electron-builder, auto-update metadata, macOS notarization, Windows signing, and Homebrew tap publishing.

## Credits

Recordly originally started as a fork of [OpenScreen](https://github.com/siddharthvaddem/openscreen) and has since been substantially changed.

## License

This project is licensed under the [AGPL 3.0](LICENSE.md).
