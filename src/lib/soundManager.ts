/**
 * Sound Manager for playing cursor click sounds
 */

export type SoundType = 'click' | 'double-click' | 'right-click' | 'soft' | 'mechanical' | 'pop' | 'bubble' | 'wooden' | 'metallic' | 'glass' | 'swoosh' | 'beep' | 'snap' | 'thud' | 'chirp' | 'coin' | 'laser' | 'drum' | 'bell' | 'whomp' | 'tick' | 'zap';

interface AudioPool {
	elements: HTMLAudioElement[];
	currentIndex: number;
}

class SoundManager {
	private sounds: Map<SoundType, AudioPool> = new Map();
	private enabled = true;
	private volume = 0.3;
	private poolSize = 5;
	private clickSoundVariant: 'default' | 'soft' | 'mechanical' | 'pop' | 'bubble' | 'wooden' | 'metallic' | 'glass' | 'swoosh' | 'beep' | 'snap' | 'thud' | 'chirp' | 'coin' | 'laser' | 'drum' | 'bell' | 'whomp' | 'tick' | 'zap' = 'default';

	constructor() {
		// Initialize pools for each sound type
		this.initializeSoundPools();
	}

	private initializeSoundPools() {
		const soundTypes: SoundType[] = ['click', 'double-click', 'right-click', 'soft', 'mechanical', 'pop', 'bubble', 'wooden', 'metallic', 'glass', 'swoosh', 'beep', 'snap', 'thud', 'chirp', 'coin', 'laser', 'drum', 'bell', 'whomp', 'tick', 'zap'];
		
		for (const type of soundTypes) {
			this.sounds.set(type, {
				elements: [],
				currentIndex: 0,
			});
		}
	}

	private createAudioPool(soundPath: string): HTMLAudioElement[] {
		const pool: HTMLAudioElement[] = [];
		for (let i = 0; i < this.poolSize; i++) {
			const audio = new Audio();
			audio.volume = this.volume;
			audio.preload = 'auto';
			audio.src = soundPath;
			pool.push(audio);
		}
		return pool;
	}

	/**
	 * Load a specific sound type
	 */
	loadSound(type: SoundType, soundPath: string) {
		try {
			const pool = this.sounds.get(type);
			if (pool) {
				pool.elements = this.createAudioPool(soundPath);
				pool.currentIndex = 0;
			}
		} catch (error) {
			console.warn(`Failed to load ${type} sound:`, error);
		}
	}

	/**
	 * Load all sounds at once
	 */
	loadAllSounds(soundPaths: Record<string, string>) {
		this.loadSound('click', soundPaths.default || soundPaths.click);
		this.loadSound('double-click', soundPaths.double || soundPaths['double-click']);
		this.loadSound('right-click', soundPaths.right || soundPaths['right-click']);
		this.loadSound('soft', soundPaths.soft);
		this.loadSound('mechanical', soundPaths.mechanical);
		this.loadSound('pop', soundPaths.pop);
		this.loadSound('bubble', soundPaths.bubble);
		this.loadSound('wooden', soundPaths.wooden);
		this.loadSound('metallic', soundPaths.metallic);
		this.loadSound('glass', soundPaths.glass);
		this.loadSound('swoosh', soundPaths.swoosh);
		this.loadSound('beep', soundPaths.beep);
		this.loadSound('snap', soundPaths.snap);
		this.loadSound('thud', soundPaths.thud);
		this.loadSound('chirp', soundPaths.chirp);
		this.loadSound('coin', soundPaths.coin);
		this.loadSound('laser', soundPaths.laser);
		this.loadSound('drum', soundPaths.drum);
		this.loadSound('bell', soundPaths.bell);
		this.loadSound('whomp', soundPaths.whomp);
		this.loadSound('tick', soundPaths.tick);
		this.loadSound('zap', soundPaths.zap);
	}

	/**
	 * Load the default click sound (backward compatibility)
	 */
	loadClickSound(soundPath: string) {
		this.loadSound('click', soundPath);
	}

	/**
	 * Set the click sound variant to use for regular clicks
	 */
	setClickSoundVariant(variant: 'default' | 'soft' | 'mechanical' | 'pop' | 'bubble' | 'wooden' | 'metallic' | 'glass' | 'swoosh' | 'beep' | 'snap' | 'thud' | 'chirp' | 'coin' | 'laser' | 'drum' | 'bell' | 'whomp' | 'tick' | 'zap') {
		this.clickSoundVariant = variant;
	}

	/**
	 * Get the current click sound variant
	 */
	getClickSoundVariant(): 'default' | 'soft' | 'mechanical' | 'pop' | 'bubble' | 'wooden' | 'metallic' | 'glass' | 'swoosh' | 'beep' | 'snap' | 'thud' | 'chirp' | 'coin' | 'laser' | 'drum' | 'bell' | 'whomp' | 'tick' | 'zap' {
		return this.clickSoundVariant;
	}

	/**
	 * Play a specific sound type
	 */
	private playSound(type: SoundType) {
		if (!this.enabled) {
			return;
		}

		const pool = this.sounds.get(type);
		if (!pool || pool.elements.length === 0) {
			return;
		}

		try {
			const audio = pool.elements[pool.currentIndex];
			pool.currentIndex = (pool.currentIndex + 1) % pool.elements.length;

			audio.currentTime = 0;
			audio.volume = this.volume;
			audio.play().catch((err) => {
				console.debug(`${type} sound play failed:`, err);
			});
		} catch (error) {
			console.debug(`Error playing ${type} sound:`, error);
		}
	}

	/**
	 * Play the click sound (uses selected variant)
	 */
	playClick() {
		const soundType = this.clickSoundVariant === 'default' ? 'click' : this.clickSoundVariant;
		this.playSound(soundType);
	}

	/**
	 * Play double-click sound
	 */
	playDoubleClick() {
		this.playSound('double-click');
	}

	/**
	 * Play right-click sound
	 */
	playRightClick() {
		this.playSound('right-click');
	}

	/**
	 * Play middle-click sound (uses regular click)
	 */
	playMiddleClick() {
		this.playClick();
	}

	/**
	 * Play sound based on interaction type
	 */
	playInteraction(interactionType: string) {
		switch (interactionType) {
			case 'double-click':
				this.playDoubleClick();
				break;
			case 'right-click':
				this.playRightClick();
				break;
			case 'middle-click':
				this.playMiddleClick();
				break;
			case 'click':
			default:
				this.playClick();
				break;
		}
	}

	/**
	 * Enable or disable click sounds
	 */
	setEnabled(enabled: boolean) {
		this.enabled = enabled;
	}

	/**
	 * Check if click sounds are enabled
	 */
	isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Set the volume (0.0 to 1.0)
	 */
	setVolume(volume: number) {
		this.volume = Math.max(0, Math.min(1, volume));
		
		// Update volume for all audio elements
		for (const pool of this.sounds.values()) {
			for (const audio of pool.elements) {
				audio.volume = this.volume;
			}
		}
	}

	/**
	 * Get the current volume
	 */
	getVolume(): number {
		return this.volume;
	}

	/**
	 * Clean up resources
	 */
	destroy() {
		for (const pool of this.sounds.values()) {
			for (const audio of pool.elements) {
				audio.pause();
				audio.src = '';
			}
			pool.elements = [];
		}
		this.sounds.clear();
	}
}

// Export a singleton instance
export const soundManager = new SoundManager();
