import { describe, expect, it } from "vitest";
import { mapAudioInputDevices, shouldRequestMicrophoneLabels } from "./useMicrophoneDevices";

function createDevice(overrides: Partial<MediaDeviceInfo>): MediaDeviceInfo {
	return {
		deviceId: "",
		groupId: "",
		kind: "audioinput",
		label: "",
		toJSON: () => ({}),
		...overrides,
	} as MediaDeviceInfo;
}

describe("useMicrophoneDevices helpers", () => {
	it("requests microphone permission when audio inputs have no visible labels", () => {
		const devices = [
			createDevice({ deviceId: "mic-1", label: "", kind: "audioinput" }),
			createDevice({ deviceId: "spk-1", label: "Speakers", kind: "audiooutput" }),
		];

		expect(shouldRequestMicrophoneLabels(devices)).toBe(true);
	});

	it("does not request microphone permission when at least one input label is already visible", () => {
		const devices = [
			createDevice({ deviceId: "mic-1", label: "USB Microphone", kind: "audioinput" }),
			createDevice({ deviceId: "mic-2", label: "", kind: "audioinput" }),
		];

		expect(shouldRequestMicrophoneLabels(devices)).toBe(false);
	});

	it("maps blank labels to deterministic fallback names without affecting permission detection", () => {
		const devices = [createDevice({ deviceId: "abcd1234", label: "", kind: "audioinput" })];

		expect(mapAudioInputDevices(devices)).toEqual([
			{
				deviceId: "abcd1234",
				groupId: "",
				label: "Microphone abcd1234",
			},
		]);
		expect(shouldRequestMicrophoneLabels(devices)).toBe(true);
	});
});
