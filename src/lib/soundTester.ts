/**
 * Sound Tester - Console utilities for testing cursor click sounds
 * 
 * Usage in browser console:
 * - testAllSounds() - Play all 10 variants in sequence
 * - testSound('bubble') - Play a specific variant
 * - testInteractions() - Test click, double-click, right-click
 * - testVolume() - Test volume levels
 */

import { soundManager } from './soundManager';

/**
 * Test all sound variants in sequence
 */
export function testAllSounds() {
	const variants = [
		'default',
		'soft',
		'mechanical',
		'pop',
		'bubble',
		'wooden',
		'metallic',
		'glass',
		'swoosh',
		'beep',
		'snap',
		'thud',
		'chirp',
		'coin',
		'laser',
		'drum',
		'bell',
		'whomp',
		'tick',
		'zap',
	] as const;

	console.log('🎵 Testing all 20 sound variants...');
	
	variants.forEach((variant, index) => {
		setTimeout(() => {
			soundManager.setClickSoundVariant(variant);
			soundManager.playClick();
			console.log(`${index + 1}/20: Playing "${variant}" sound`);
		}, index * 600);
	});

	setTimeout(() => {
		console.log('✅ All sounds tested!');
	}, variants.length * 600);
}

/**
 * Test a specific sound variant
 */
export function testSound(variant: 'default' | 'soft' | 'mechanical' | 'pop' | 'bubble' | 'wooden' | 'metallic' | 'glass' | 'swoosh' | 'beep' | 'snap' | 'thud' | 'chirp' | 'coin' | 'laser' | 'drum' | 'bell' | 'whomp' | 'tick' | 'zap') {
	console.log(`🎵 Testing "${variant}" sound...`);
	soundManager.setClickSoundVariant(variant);
	soundManager.playClick();
}

/**
 * Test different interaction types
 */
export function testInteractions() {
	console.log('🎵 Testing interaction types...');
	
	setTimeout(() => {
		console.log('1/3: Click');
		soundManager.playClick();
	}, 0);

	setTimeout(() => {
		console.log('2/3: Double-click');
		soundManager.playDoubleClick();
	}, 800);

	setTimeout(() => {
		console.log('3/3: Right-click');
		soundManager.playRightClick();
	}, 1600);

	setTimeout(() => {
		console.log('✅ All interactions tested!');
	}, 2400);
}

/**
 * Test volume levels
 */
export function testVolume() {
	console.log('🎵 Testing volume levels...');
	
	const volumes = [0.1, 0.3, 0.5, 0.7, 1.0];
	
	volumes.forEach((volume, index) => {
		setTimeout(() => {
			soundManager.setVolume(volume);
			soundManager.playClick();
			console.log(`${index + 1}/5: Volume ${Math.round(volume * 100)}%`);
		}, index * 500);
	});

	setTimeout(() => {
		soundManager.setVolume(0.3); // Reset to default
		console.log('✅ Volume test complete! Reset to 30%');
	}, volumes.length * 500);
}

/**
 * Test rapid clicks (audio pooling)
 */
export function testRapidClicks() {
	console.log('🎵 Testing rapid clicks (audio pooling)...');
	
	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			soundManager.playClick();
		}, i * 50); // 50ms between clicks
	}

	setTimeout(() => {
		console.log('✅ Rapid click test complete!');
	}, 600);
}

/**
 * Test enable/disable
 */
export function testEnableDisable() {
	console.log('🎵 Testing enable/disable...');
	
	setTimeout(() => {
		console.log('1/4: Enabled - should hear sound');
		soundManager.setEnabled(true);
		soundManager.playClick();
	}, 0);

	setTimeout(() => {
		console.log('2/4: Disabled - should NOT hear sound');
		soundManager.setEnabled(false);
		soundManager.playClick();
	}, 800);

	setTimeout(() => {
		console.log('3/4: Still disabled - should NOT hear sound');
		soundManager.playClick();
	}, 1600);

	setTimeout(() => {
		console.log('4/4: Re-enabled - should hear sound');
		soundManager.setEnabled(true);
		soundManager.playClick();
	}, 2400);

	setTimeout(() => {
		console.log('✅ Enable/disable test complete!');
	}, 3200);
}

/**
 * Play a sound showcase with descriptions
 */
export function soundShowcase() {
	const sounds = [
		{ variant: 'default', name: 'Default', desc: 'Professional tone' },
		{ variant: 'soft', name: 'Soft', desc: 'Gentle & quiet' },
		{ variant: 'mechanical', name: 'Mechanical', desc: 'Sharp & crisp' },
		{ variant: 'pop', name: 'Pop', desc: 'Playful & bouncy' },
		{ variant: 'bubble', name: 'Bubble', desc: 'Water droplet' },
		{ variant: 'wooden', name: 'Wooden', desc: 'Natural knock' },
		{ variant: 'metallic', name: 'Metallic', desc: 'Metal tap' },
		{ variant: 'glass', name: 'Glass', desc: 'Crystal ring' },
		{ variant: 'swoosh', name: 'Swoosh', desc: 'Air whoosh' },
		{ variant: 'beep', name: 'Beep', desc: 'Electronic tone' },
		{ variant: 'snap', name: 'Snap', desc: 'Finger snap' },
		{ variant: 'thud', name: 'Thud', desc: 'Deep impact' },
		{ variant: 'chirp', name: 'Chirp', desc: 'Bird tweet' },
		{ variant: 'coin', name: 'Coin', desc: 'Arcade coin' },
		{ variant: 'laser', name: 'Laser', desc: 'Sci-fi zap' },
		{ variant: 'drum', name: 'Drum', desc: 'Kick drum' },
		{ variant: 'bell', name: 'Bell', desc: 'Chime ring' },
		{ variant: 'whomp', name: 'Whomp', desc: 'Bass drop' },
		{ variant: 'tick', name: 'Tick', desc: 'Clock tick' },
		{ variant: 'zap', name: 'Zap', desc: 'Electric spark' },
	] as const;

	console.log('🎵 Sound Showcase - 20 Variants');
	console.log('================================');
	
	sounds.forEach((sound, index) => {
		setTimeout(() => {
			soundManager.setClickSoundVariant(sound.variant);
			soundManager.playClick();
			console.log(`${index + 1}. ${sound.name} - ${sound.desc}`);
		}, index * 800);
	});

	setTimeout(() => {
		console.log('================================');
		console.log('✅ Showcase complete!');
	}, sounds.length * 800);
}

/**
 * Get current sound manager status
 */
export function getSoundStatus() {
	console.log('🎵 Sound Manager Status');
	console.log('======================');
	console.log(`Enabled: ${soundManager.isEnabled()}`);
	console.log(`Volume: ${Math.round(soundManager.getVolume() * 100)}%`);
	console.log(`Variant: ${soundManager.getClickSoundVariant()}`);
	console.log('======================');
}

// Expose to window for console access (only in development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
	(window as any).soundTester = {
		testAllSounds,
		testSound,
		testInteractions,
		testVolume,
		testRapidClicks,
		testEnableDisable,
		soundShowcase,
		getSoundStatus,
		soundManager,
	};
	
	console.log('🎵 Sound Tester loaded! Available commands:');
	console.log('  soundTester.testAllSounds() - Test all 20 variants');
	console.log('  soundTester.testSound("snap") - Test specific variant');
	console.log('  soundTester.testInteractions() - Test click types');
	console.log('  soundTester.testVolume() - Test volume levels');
	console.log('  soundTester.testRapidClicks() - Test audio pooling');
	console.log('  soundTester.testEnableDisable() - Test on/off');
	console.log('  soundTester.soundShowcase() - Play all with descriptions');
	console.log('  soundTester.getSoundStatus() - Show current settings');
}
