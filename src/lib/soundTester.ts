/**
 * Sound Tester Utility
 * Provides functions to test and demo all click sounds
 */

import { soundManager } from './soundManager';
import { generateAllClickSounds } from './generateClickSound';

export class SoundTester {
	private initialized = false;

	/**
	 * Initialize all sounds
	 */
	async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		console.log('🔊 Initializing click sounds...');
		const startTime = performance.now();

		try {
			const sounds = await generateAllClickSounds();
			soundManager.loadAllSounds(sounds);
			this.initialized = true;

			const duration = Math.round(performance.now() - startTime);
			console.log(`✅ Click sounds initialized in ${duration}ms`);
			console.log('Available sounds:', Object.keys(sounds));
		} catch (error) {
			console.error('❌ Failed to initialize sounds:', error);
			throw error;
		}
	}

	/**
	 * Test all sound types in sequence
	 */
	async testAllSounds(): Promise<void> {
		await this.initialize();

		console.log('🎵 Testing all sound types...');

		const tests = [
			{ name: 'Default Click', fn: () => soundManager.playClick(), delay: 0 },
			{ name: 'Double-Click', fn: () => soundManager.playDoubleClick(), delay: 600 },
			{ name: 'Right-Click', fn: () => soundManager.playRightClick(), delay: 1200 },
			{ name: 'Soft Click', fn: () => {
				soundManager.setClickSoundVariant('soft');
				soundManager.playClick();
			}, delay: 1800 },
			{ name: 'Mechanical Click', fn: () => {
				soundManager.setClickSoundVariant('mechanical');
				soundManager.playClick();
			}, delay: 2400 },
			{ name: 'Pop Sound', fn: () => {
				soundManager.setClickSoundVariant('pop');
				soundManager.playClick();
			}, delay: 3000 },
		];

		for (const test of tests) {
			setTimeout(() => {
				console.log(`  Playing: ${test.name}`);
				test.fn();
			}, test.delay);
		}

		// Reset to default
		setTimeout(() => {
			soundManager.setClickSoundVariant('default');
			console.log('✅ Sound test complete');
		}, 3600);
	}

	/**
	 * Test rapid clicks (stress test)
	 */
	async testRapidClicks(count = 10, interval = 100): Promise<void> {
		await this.initialize();

		console.log(`🎵 Testing ${count} rapid clicks (${interval}ms interval)...`);

		for (let i = 0; i < count; i++) {
			setTimeout(() => {
				soundManager.playClick();
				console.log(`  Click ${i + 1}/${count}`);
			}, i * interval);
		}

		setTimeout(() => {
			console.log('✅ Rapid click test complete');
		}, count * interval + 100);
	}

	/**
	 * Test all variants
	 */
	async testAllVariants(): Promise<void> {
		await this.initialize();

		console.log('🎵 Testing all click variants...');

		const variants: Array<'default' | 'soft' | 'mechanical' | 'pop'> = [
			'default',
			'soft',
			'mechanical',
			'pop',
		];

		for (let i = 0; i < variants.length; i++) {
			setTimeout(() => {
				const variant = variants[i];
				soundManager.setClickSoundVariant(variant);
				console.log(`  Playing: ${variant} variant`);
				soundManager.playClick();
			}, i * 500);
		}

		setTimeout(() => {
			soundManager.setClickSoundVariant('default');
			console.log('✅ Variant test complete');
		}, variants.length * 500 + 100);
	}

	/**
	 * Test volume levels
	 */
	async testVolumeLevels(): Promise<void> {
		await this.initialize();

		console.log('🎵 Testing volume levels...');

		const volumes = [0.1, 0.3, 0.5, 0.7, 1.0];

		for (let i = 0; i < volumes.length; i++) {
			setTimeout(() => {
				const volume = volumes[i];
				soundManager.setVolume(volume);
				console.log(`  Volume: ${Math.round(volume * 100)}%`);
				soundManager.playClick();
			}, i * 600);
		}

		setTimeout(() => {
			soundManager.setVolume(0.3); // Reset to default
			console.log('✅ Volume test complete');
		}, volumes.length * 600 + 100);
	}

	/**
	 * Test interaction types
	 */
	async testInteractionTypes(): Promise<void> {
		await this.initialize();

		console.log('🎵 Testing interaction types...');

		const interactions = [
			'click',
			'double-click',
			'right-click',
			'middle-click',
		];

		for (let i = 0; i < interactions.length; i++) {
			setTimeout(() => {
				const type = interactions[i];
				console.log(`  Interaction: ${type}`);
				soundManager.playInteraction(type);
			}, i * 700);
		}

		setTimeout(() => {
			console.log('✅ Interaction test complete');
		}, interactions.length * 700 + 100);
	}

	/**
	 * Get sound statistics
	 */
	getStats(): {
		initialized: boolean;
		enabled: boolean;
		volume: number;
		variant: string;
	} {
		return {
			initialized: this.initialized,
			enabled: soundManager.isEnabled(),
			volume: soundManager.getVolume(),
			variant: soundManager.getClickSoundVariant(),
		};
	}

	/**
	 * Print current configuration
	 */
	printConfig(): void {
		const stats = this.getStats();
		console.log('🔊 Sound Manager Configuration:');
		console.log(`  Initialized: ${stats.initialized}`);
		console.log(`  Enabled: ${stats.enabled}`);
		console.log(`  Volume: ${Math.round(stats.volume * 100)}%`);
		console.log(`  Variant: ${stats.variant}`);
	}
}

// Export singleton instance
export const soundTester = new SoundTester();

// Add to window for easy console access
if (typeof window !== 'undefined') {
	(window as any).soundTester = soundTester;
	(window as any).soundManager = soundManager;
}

/**
 * Quick test functions for console use
 */
export const quickTests = {
	/**
	 * Test all sounds: window.quickTests.all()
	 */
	all: () => soundTester.testAllSounds(),

	/**
	 * Test rapid clicks: window.quickTests.rapid()
	 */
	rapid: () => soundTester.testRapidClicks(),

	/**
	 * Test variants: window.quickTests.variants()
	 */
	variants: () => soundTester.testAllVariants(),

	/**
	 * Test volumes: window.quickTests.volumes()
	 */
	volumes: () => soundTester.testVolumeLevels(),

	/**
	 * Test interactions: window.quickTests.interactions()
	 */
	interactions: () => soundTester.testInteractionTypes(),

	/**
	 * Show config: window.quickTests.config()
	 */
	config: () => soundTester.printConfig(),

	/**
	 * Play single click: window.quickTests.click()
	 */
	click: () => soundManager.playClick(),

	/**
	 * Play double-click: window.quickTests.double()
	 */
	double: () => soundManager.playDoubleClick(),

	/**
	 * Play right-click: window.quickTests.right()
	 */
	right: () => soundManager.playRightClick(),

	/**
	 * Set variant: window.quickTests.variant('soft')
	 */
	variant: (v: 'default' | 'soft' | 'mechanical' | 'pop') => {
		soundManager.setClickSoundVariant(v);
		console.log(`✅ Variant set to: ${v}`);
	},

	/**
	 * Set volume: window.quickTests.volume(0.5)
	 */
	volume: (v: number) => {
		soundManager.setVolume(v);
		console.log(`✅ Volume set to: ${Math.round(v * 100)}%`);
	},

	/**
	 * Toggle enabled: window.quickTests.toggle()
	 */
	toggle: () => {
		const newState = !soundManager.isEnabled();
		soundManager.setEnabled(newState);
		console.log(`✅ Sounds ${newState ? 'enabled' : 'disabled'}`);
	},
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
	(window as any).quickTests = quickTests;
	console.log('🎵 Sound testing utilities loaded!');
	console.log('Try: quickTests.all() or quickTests.click()');
}
