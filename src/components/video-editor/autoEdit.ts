import type { TrimRegion } from "./types";

const AUTO_EDIT_FRAME_MS = 50;
const AUTO_EDIT_SILENCE_DB_THRESHOLD = -40;
const AUTO_EDIT_MIN_SILENCE_MS = 900;
const AUTO_EDIT_MIN_TRIM_MS = 500;
const AUTO_EDIT_KEEP_CONTEXT_MS = 140;
const AUTO_EDIT_MAX_TRIMS = 18;
const AUTO_EDIT_MIN_RETAIN_MS = 1500;
const AUTO_EDIT_MAX_TOTAL_TRIM_RATIO = 0.85;

type FallbackPathsResult = Awaited<ReturnType<typeof window.electronAPI.getVideoAudioFallbackPaths>>;

export interface AutoEditSuggestionResult {
	trimRegions: TrimRegion[];
	analyzedPath: string | null;
	totalTrimmedMs: number;
}

function toArrayBuffer(data: unknown): ArrayBuffer {
	if (ArrayBuffer.isView(data)) {
		const sliced = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
		if (sliced instanceof ArrayBuffer) {
			return sliced;
		}
		throw new Error("Unsupported SharedArrayBuffer payload returned from main process.");
	}

	if (data instanceof ArrayBuffer) {
		return data.slice(0);
	}

	// Electron IPC serializes Node.js Buffer as { type: 'Buffer', data: number[] }
	if (
		data !== null &&
		typeof data === "object" &&
		(data as { type?: unknown }).type === "Buffer" &&
		Array.isArray((data as { data?: unknown }).data)
	) {
		const bytes = (data as { data: number[] }).data;
		const buffer = new ArrayBuffer(bytes.length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < bytes.length; i++) {
			view[i] = bytes[i] ?? 0;
		}
		return buffer;
	}

	throw new Error("Unsupported file payload returned from main process.");
}

function computeFrameRms(
	channelData: Float32Array[],
	startSample: number,
	endSampleExclusive: number,
): number {
	let sum = 0;
	let count = 0;

	for (const channel of channelData) {
		for (let index = startSample; index < endSampleExclusive; index += 1) {
			const sample = channel[index] ?? 0;
			sum += sample * sample;
			count += 1;
		}
	}

	if (count === 0) {
		return 0;
	}

	return Math.sqrt(sum / count);
}

function rmsToDb(rms: number): number {
	if (!Number.isFinite(rms) || rms <= 0) {
		return -120;
	}

	return 20 * Math.log10(rms);
}

async function decodeAudioBufferFromFile(filePath: string): Promise<AudioBuffer> {
	const readResult = await window.electronAPI.readLocalFile(filePath);
	if (!readResult.success || !readResult.data) {
		throw new Error(readResult.error || `Unable to read ${filePath}`);
	}

	return decodeAudioBufferFromData(readResult.data, filePath);
}

async function decodeAudioBufferFromData(data: unknown, sourceLabel: string): Promise<AudioBuffer> {
	const AudioContextCtor =
		window.AudioContext ||
		(window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

	if (!AudioContextCtor) {
		throw new Error("Web Audio API is not available in this environment.");
	}

	const audioContext = new AudioContextCtor();

	try {
		const arrayBuffer = toArrayBuffer(data);
		console.log(`[AutoEdit] Decoding audio from ${sourceLabel}, size: ${arrayBuffer.byteLength} bytes`);
		const decoded = await audioContext.decodeAudioData(arrayBuffer);
		console.log(`[AutoEdit] Successfully decoded audio: ${decoded.duration}s, ${decoded.numberOfChannels} channels`);
		return decoded;
	} catch (error) {
		console.error(`[AutoEdit] Failed to decode audio from ${sourceLabel}:`, error);
		throw error;
	} finally {
		await audioContext.close().catch(() => undefined);
	}
}

function buildTrimRegionsFromAudioBuffer(audioBuffer: AudioBuffer): TrimRegion[] {
	const durationMs = Math.round(audioBuffer.duration * 1000);
	if (!Number.isFinite(durationMs) || durationMs <= AUTO_EDIT_MIN_SILENCE_MS) {
		return [];
	}

	const samplesPerFrame = Math.max(
		1,
		Math.round((audioBuffer.sampleRate * AUTO_EDIT_FRAME_MS) / 1000),
	);
	const frameCount = Math.ceil(audioBuffer.length / samplesPerFrame);
	const channelData = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
		audioBuffer.getChannelData(index),
	);

	const silentFrames: boolean[] = [];
	for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
		const startSample = frameIndex * samplesPerFrame;
		const endSampleExclusive = Math.min(audioBuffer.length, startSample + samplesPerFrame);
		const rms = computeFrameRms(channelData, startSample, endSampleExclusive);
		silentFrames.push(rmsToDb(rms) <= AUTO_EDIT_SILENCE_DB_THRESHOLD);
	}

	const trimRegions: TrimRegion[] = [];
	let frameRunStart = -1;

	const pushTrimRegion = (runStartFrame: number, runEndFrameExclusive: number) => {
		const rawStartMs = runStartFrame * AUTO_EDIT_FRAME_MS;
		const rawEndMs = Math.min(durationMs, runEndFrameExclusive * AUTO_EDIT_FRAME_MS);
		const rawDurationMs = rawEndMs - rawStartMs;

		if (rawDurationMs < AUTO_EDIT_MIN_SILENCE_MS) {
			return;
		}

		const trimStartMs =
			rawStartMs <= AUTO_EDIT_KEEP_CONTEXT_MS ? 0 : rawStartMs + AUTO_EDIT_KEEP_CONTEXT_MS;
		const trimEndMs =
			rawEndMs >= durationMs - AUTO_EDIT_KEEP_CONTEXT_MS
				? durationMs
				: rawEndMs - AUTO_EDIT_KEEP_CONTEXT_MS;

		if (trimEndMs - trimStartMs < AUTO_EDIT_MIN_TRIM_MS) {
			return;
		}

		trimRegions.push({
			id: `trim-${trimRegions.length + 1}`,
			startMs: trimStartMs,
			endMs: trimEndMs,
		});
	};

	for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
		if (silentFrames[frameIndex]) {
			if (frameRunStart === -1) {
				frameRunStart = frameIndex;
			}
			continue;
		}

		if (frameRunStart !== -1) {
			pushTrimRegion(frameRunStart, frameIndex);
			frameRunStart = -1;
		}
	}

	if (frameRunStart !== -1) {
		pushTrimRegion(frameRunStart, frameCount);
	}

	const limitedTrimRegions =
		trimRegions.length <= AUTO_EDIT_MAX_TRIMS
			? trimRegions
			: [...trimRegions]
		.sort((left, right) => (right.endMs - right.startMs) - (left.endMs - left.startMs))
		.slice(0, AUTO_EDIT_MAX_TRIMS)
		.sort((left, right) => left.startMs - right.startMs)
		.map((region, index) => ({ ...region, id: `trim-${index + 1}` }));

	const totalTrimmedMs = limitedTrimRegions.reduce(
		(total, region) => total + (region.endMs - region.startMs),
		0,
	);
	const trimmedRatio = durationMs > 0 ? totalTrimmedMs / durationMs : 0;

	if (
		totalTrimmedMs >= durationMs - AUTO_EDIT_MIN_RETAIN_MS ||
		trimmedRatio >= AUTO_EDIT_MAX_TOTAL_TRIM_RATIO
	) {
		return [];
	}

	return limitedTrimRegions;
}

function buildCandidateAnalysisPaths(
	videoPath: string,
	fallbackPathsResult?: FallbackPathsResult | null,
): string[] {
	const fallbackPaths =
		fallbackPathsResult?.success && Array.isArray(fallbackPathsResult.paths)
			? fallbackPathsResult.paths
			: [];

	return Array.from(
		new Set([
			...fallbackPaths.filter((path): path is string => Boolean(path)),
			videoPath,
		]),
	);
}

export async function suggestAutoEditFromVideo(videoPath: string): Promise<AutoEditSuggestionResult> {
	console.log(`[AutoEdit] Starting auto edit analysis for: ${videoPath}`);

	const fallbackPathsResult = await window.electronAPI.getVideoAudioFallbackPaths(videoPath).catch(
		(error) => {
			console.warn(`[AutoEdit] Failed to get fallback paths:`, error);
			return null;
		},
	);

	const candidatePaths = buildCandidateAnalysisPaths(videoPath, fallbackPathsResult);
	console.log(`[AutoEdit] Candidate audio paths:`, candidatePaths);

	let lastError: unknown = null;

	const fallbackAudioPaths = candidatePaths.filter((candidatePath) => candidatePath !== videoPath);
	for (const candidatePath of fallbackAudioPaths) {
		console.log(`[AutoEdit] Trying to analyze: ${candidatePath}`);
		try {
			const audioBuffer = await decodeAudioBufferFromFile(candidatePath);
			const trimRegions = buildTrimRegionsFromAudioBuffer(audioBuffer);
			const totalTrimmedMs = trimRegions.reduce(
				(total, region) => total + (region.endMs - region.startMs),
				0,
			);

			console.log(`[AutoEdit] Analysis complete. Found ${trimRegions.length} trim regions, total trimmed: ${totalTrimmedMs}ms`);

			return {
				trimRegions,
				analyzedPath: candidatePath,
				totalTrimmedMs,
			};
		} catch (error) {
			console.warn(`[AutoEdit] Failed to analyze ${candidatePath}:`, error);
			lastError = error;
		}
	}

	if (typeof window.electronAPI.extractVideoAudioForAnalysis === "function") {
		try {
			console.log(`[AutoEdit] Extracting audio track for analysis: ${videoPath}`);
			const extractedAudio = await window.electronAPI.extractVideoAudioForAnalysis(videoPath);
			if (!extractedAudio.success || !extractedAudio.data) {
				throw new Error(extractedAudio.error || "Unable to extract audio from the video.");
			}

			const audioBuffer = await decodeAudioBufferFromData(
				extractedAudio.data,
				`${extractedAudio.sourcePath ?? videoPath} (extracted audio)`,
			);
			const trimRegions = buildTrimRegionsFromAudioBuffer(audioBuffer);
			const totalTrimmedMs = trimRegions.reduce(
				(total, region) => total + (region.endMs - region.startMs),
				0,
			);

			console.log(`[AutoEdit] Analysis complete. Found ${trimRegions.length} trim regions, total trimmed: ${totalTrimmedMs}ms`);

			return {
				trimRegions,
				analyzedPath: extractedAudio.sourcePath ?? videoPath,
				totalTrimmedMs,
			};
		} catch (error) {
			console.warn(`[AutoEdit] Failed to analyze extracted audio:`, error);
			lastError = error;
		}
	}

	try {
		console.log(`[AutoEdit] Trying direct audio decode fallback: ${videoPath}`);
		const audioBuffer = await decodeAudioBufferFromFile(videoPath);
		const trimRegions = buildTrimRegionsFromAudioBuffer(audioBuffer);
		const totalTrimmedMs = trimRegions.reduce(
			(total, region) => total + (region.endMs - region.startMs),
			0,
		);

		console.log(`[AutoEdit] Analysis complete. Found ${trimRegions.length} trim regions, total trimmed: ${totalTrimmedMs}ms`);

		return {
			trimRegions,
			analyzedPath: videoPath,
			totalTrimmedMs,
		};
	} catch (error) {
		console.warn(`[AutoEdit] Failed to analyze ${videoPath}:`, error);
		lastError = error;
	}

	console.warn(`[AutoEdit] No decodable audio found to analyze. Last error:`, lastError);
	return {
		trimRegions: [],
		analyzedPath: null,
		totalTrimmedMs: 0,
	};
}
