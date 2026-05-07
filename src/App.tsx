import { useEffect, useState } from "react";
import { CountdownOverlay } from "./components/countdown/CountdownOverlay";
import { LaunchWindow } from "./components/launch/LaunchWindow";
import { SourceSelector } from "./components/launch/SourceSelector";
import { UpdateToastWindow } from "./components/launch/UpdateToastWindow";
import { Toaster } from "./components/ui/sonner";
import { ShortcutsConfigDialog } from "./components/video-editor/ShortcutsConfigDialog";
import VideoEditor from "./components/video-editor/VideoEditor";
import crabLogo from "../icons/icons/png/logo.jpg";
import { useI18n } from "./contexts/I18nContext";
import { ShortcutsProvider } from "./contexts/ShortcutsContext";
import { loadAllCustomFonts } from "./lib/customFonts";

const DOWNLOAD_LINKS = {
	windows: "https://github.com/webadderall/Recordly/releases/download/v1.1.14/Recordly-windows-x64.exe",
	macAppleSilicon: "https://github.com/webadderall/Recordly/releases/download/v1.1.14/Recordly-arm64.dmg",
	macIntel: "https://github.com/webadderall/Recordly/releases/download/v1.1.14/Recordly-x64.dmg",
	linux: "https://github.com/webadderall/Recordly/releases/download/v1.1.14/Recordly-linux-x64.AppImage",
};

export default function App() {
	const [windowType, setWindowType] = useState("");
	const { locale, t } = useI18n();

	const openDownloadLink = async (url: string) => {
		if (window.electronAPI?.openExternalUrl) {
			const result = await window.electronAPI.openExternalUrl(url);
			if (!result.success) {
				console.error("Failed to open download link:", result.error ?? "Unknown error");
			}
			return;
		}

		const openedWindow = window.open(url, "_blank", "noopener,noreferrer");
		if (!openedWindow) {
			window.location.href = url;
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const type = params.get("windowType") || "";
		const isMacOS = /mac/i.test(navigator.platform);
		setWindowType(type);

		if (
			type === "hud-overlay" ||
			type === "source-selector" ||
			type === "countdown" ||
			(type === "update-toast" && isMacOS)
		) {
			document.body.style.background = "transparent";
			document.documentElement.style.background = "transparent";
			document.getElementById("root")?.style.setProperty("background", "transparent");
		}

		if (type === "hud-overlay" || type === "update-toast") {
			document.documentElement.style.overflow = "visible";
			document.body.style.overflow = "visible";
			document.getElementById("root")?.style.setProperty("overflow", "visible");
		}

		loadAllCustomFonts().catch((error) => {
			console.error("Failed to load custom fonts:", error);
		});
	}, []);

	useEffect(() => {
		if (!window.electronAPI?.hudOverlaySetIgnoreMouse) {
			return;
		}

		const isInstallFallbackScreen = windowType === "";
		if (!isInstallFallbackScreen) {
			return;
		}

		window.electronAPI.hudOverlaySetIgnoreMouse(false);

		return () => {
			window.electronAPI?.hudOverlaySetIgnoreMouse?.(true);
		};
	}, [windowType]);

	useEffect(() => {
		document.title =
			windowType === "editor"
				? t("app.editorTitle", "Crab Records Editor")
				: t("app.name", "Crab Records");
	}, [windowType, locale, t]);

	switch (windowType) {
		case "hud-overlay":
				return (
					<>
						<LaunchWindow />
						<Toaster theme="dark" className="pointer-events-auto" />
					</>
				);
		case "source-selector":
			return <SourceSelector />;
		case "countdown":
			return <CountdownOverlay />;
		case "update-toast":
			return <UpdateToastWindow />;
		case "editor":
			return (
				<ShortcutsProvider>
					<VideoEditor />
					<ShortcutsConfigDialog />
				</ShortcutsProvider>
			);
		default:
			return (
				<div className="flex h-full w-full items-center justify-center bg-slate-950 text-white">
					<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-6 py-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<img
								src={crabLogo}
								alt={t("app.name", "Crab Records")}
								className="h-24 w-24 rounded-xl object-cover"
							/>
							<div>
								<h1 className="text-xl font-semibold tracking-tight">{t("app.name", "Crab Records")}</h1>
								<p className="text-sm text-white/65">
									{t("app.subtitle", "Screen recording and editing")}
								</p>
							</div>
						</div>
						<div className="mt-6">
							<p className="text-sm font-medium text-white">
								{t("app.installTitle", "Install the app")}
							</p>
							<p className="mt-1 text-sm text-white/60">
								{t("app.installSubtitle", "Click your device and run the installer.")}
							</p>
							<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
								<button
									type="button"
									className="relative z-10 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-left transition pointer-events-auto hover:border-blue-400/60 hover:bg-blue-500/10"
									onClick={() => {
										void openDownloadLink(DOWNLOAD_LINKS.windows);
									}}
								>
									<span className="block text-sm font-semibold text-white">
										{t("app.installWindows", "Windows")}
									</span>
									<span className="mt-1 block text-xs text-white/55">
										{t("app.installWindowsHint", "Direct installer download (.exe)")}
									</span>
								</button>
								<button
									type="button"
									className="relative z-10 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-left transition pointer-events-auto hover:border-blue-400/60 hover:bg-blue-500/10"
									onClick={() => {
										void openDownloadLink(DOWNLOAD_LINKS.macAppleSilicon);
									}}
								>
									<span className="block text-sm font-semibold text-white">
										{t("app.installMacbook", "MacBook")}
									</span>
									<span className="mt-1 block text-xs text-white/55">
										{t("app.installMacbookHint", "Apple Silicon installer (.dmg)")}
									</span>
								</button>
								<button
									type="button"
									className="relative z-10 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-left transition pointer-events-auto hover:border-blue-400/60 hover:bg-blue-500/10"
									onClick={() => {
										void openDownloadLink(DOWNLOAD_LINKS.macIntel);
									}}
								>
									<span className="block text-sm font-semibold text-white">
										{t("app.installMacIntel", "Mac Intel")}
									</span>
									<span className="mt-1 block text-xs text-white/55">
										{t("app.installMacIntelHint", "Intel installer (.dmg)")}
									</span>
								</button>
								<button
									type="button"
									className="relative z-10 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-left transition pointer-events-auto hover:border-blue-400/60 hover:bg-blue-500/10"
									onClick={() => {
										void openDownloadLink(DOWNLOAD_LINKS.linux);
									}}
								>
									<span className="block text-sm font-semibold text-white">
										{t("app.installLinux", "Linux")}
									</span>
									<span className="mt-1 block text-xs text-white/55">
										{t("app.installLinuxHint", "Direct AppImage download")}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			);
	}
}
