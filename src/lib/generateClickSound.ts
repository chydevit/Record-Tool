export type ClickSoundType = 'default' | 'double' | 'right' | 'soft' | 'mechanical' | 'pop';

/**
 * Generate a click sound using Web Audio API
 * This creates a short, pleasant click sound without needing external audio files
 */

export function generateClickSound(): string {
	try {
		// Create an offline audio context
		const sampleRate = 44100;
		const duration = 0.1; // 100ms
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		// Create oscillator for the click sound
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		// Configure oscillator - short high-pitched tone
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.02);

		// Configure gain envelope for a sharp attack and quick decay
		gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.05);

		// Connect nodes
		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		// Start and stop
		oscillator.start(0);
		oscillator.stop(duration);

		// Render and convert to data URL
		return new Promise<string>((resolve, reject) => {
			audioContext.startRendering().then((audioBuffer) => {
				// Convert audio buffer to WAV blob
				const wavBlob = audioBufferToWav(audioBuffer);
				const url = URL.createObjectURL(wavBlob);
				resolve(url);
			}).catch(reject);
		}) as unknown as string;
	} catch (error) {
		console.error('Failed to generate click sound:', error);
		return '';
	}
}

/**
 * Convert AudioBuffer to WAV Blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
	const length = buffer.length * buffer.numberOfChannels * 2 + 44;
	const arrayBuffer = new ArrayBuffer(length);
	const view = new DataView(arrayBuffer);
	const channels: Float32Array[] = [];
	let offset = 0;
	let pos = 0;

	// Write WAV header
	setUint32(0x46464952); // "RIFF"
	setUint32(length - 8); // file length - 8
	setUint32(0x45564157); // "WAVE"

	setUint32(0x20746d66); // "fmt " chunk
	setUint32(16); // length = 16
	setUint16(1); // PCM (uncompressed)
	setUint16(buffer.numberOfChannels);
	setUint32(buffer.sampleRate);
	setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
	setUint16(buffer.numberOfChannels * 2); // block-align
	setUint16(16); // 16-bit

	setUint32(0x61746164); // "data" - chunk
	setUint32(length - pos - 4); // chunk length

	// Write interleaved data
	for (let i = 0; i < buffer.numberOfChannels; i++) {
		channels.push(buffer.getChannelData(i));
	}

	while (pos < length) {
		for (let i = 0; i < buffer.numberOfChannels; i++) {
			const sample = Math.max(-1, Math.min(1, channels[i][offset]));
			view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
			pos += 2;
		}
		offset++;
	}

	return new Blob([arrayBuffer], { type: 'audio/wav' });

	function setUint16(data: number) {
		view.setUint16(pos, data, true);
		pos += 2;
	}

	function setUint32(data: number) {
		view.setUint32(pos, data, true);
		pos += 4;
	}
}

/**
 * Generate click sound asynchronously
 */
export async function generateClickSoundAsync(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.1;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.02);

		gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.05);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(0);
		oscillator.stop(duration);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate click sound:', error);
		return '';
	}
}

/**
 * Generate a double-click sound (two quick clicks)
 */
export async function generateDoubleClickSound(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.25;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		// First click
		const osc1 = audioContext.createOscillator();
		const gain1 = audioContext.createGain();
		osc1.type = 'sine';
		osc1.frequency.setValueAtTime(1300, audioContext.currentTime);
		osc1.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.015);
		gain1.gain.setValueAtTime(0.35, audioContext.currentTime);
		gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);
		osc1.connect(gain1);
		gain1.connect(audioContext.destination);
		osc1.start(0);
		osc1.stop(0.05);

		// Second click (slightly higher pitch)
		const osc2 = audioContext.createOscillator();
		const gain2 = audioContext.createGain();
		osc2.type = 'sine';
		osc2.frequency.setValueAtTime(1400, audioContext.currentTime + 0.08);
		osc2.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.095);
		gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.08);
		gain2.gain.setValueAtTime(0.4, audioContext.currentTime + 0.08);
		gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
		osc2.connect(gain2);
		gain2.connect(audioContext.destination);
		osc2.start(0.08);
		osc2.stop(0.15);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate double-click sound:', error);
		return '';
	}
}

/**
 * Generate a right-click sound (deeper tone)
 */
export async function generateRightClickSound(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.12;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		// Lower frequency for right-click
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.03);

		gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.06);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(0);
		oscillator.stop(duration);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate right-click sound:', error);
		return '';
	}
}

/**
 * Generate a soft click sound (subtle, quiet)
 */
export async function generateSoftClickSound(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.08;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.015);

		// Quieter gain
		gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.04);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(0);
		oscillator.stop(duration);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate soft click sound:', error);
		return '';
	}
}

/**
 * Generate a mechanical click sound (sharp, crisp)
 */
export async function generateMechanicalClickSound(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.06;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		// Use square wave for mechanical sound
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();
		const filter = audioContext.createBiquadFilter();

		oscillator.type = 'square';
		oscillator.frequency.setValueAtTime(1500, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.01);

		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(2000, audioContext.currentTime);

		// Sharp attack, quick decay
		gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.03);

		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(0);
		oscillator.stop(duration);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate mechanical click sound:', error);
		return '';
	}
}

/**
 * Generate a pop sound (bubbly, playful)
 */
export async function generatePopSound(): Promise<string> {
	try {
		const sampleRate = 44100;
		const duration = 0.15;
		const audioContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		// Start high and drop quickly for pop effect
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);

		// Pop envelope
		gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.08);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(0);
		oscillator.stop(duration);

		const audioBuffer = await audioContext.startRendering();
		const wavBlob = audioBufferToWav(audioBuffer);
		return URL.createObjectURL(wavBlob);
	} catch (error) {
		console.error('Failed to generate pop sound:', error);
		return '';
	}
}

/**
 * Generate all click sounds and return a map
 */
export async function generateAllClickSounds(): Promise<Record<ClickSoundType, string>> {
	const [defaultSound, doubleSound, rightSound, softSound, mechanicalSound, popSound] = await Promise.all([
		generateClickSoundAsync(),
		generateDoubleClickSound(),
		generateRightClickSound(),
		generateSoftClickSound(),
		generateMechanicalClickSound(),
		generatePopSound(),
	]);

	return {
		default: defaultSound,
		double: doubleSound,
		right: rightSound,
		soft: softSound,
		mechanical: mechanicalSound,
		pop: popSound,
	};
}
