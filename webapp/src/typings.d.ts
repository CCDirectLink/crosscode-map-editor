declare module '*.json' {
	const value: any;
	export default value;
}

// Type declarations for Clipboard API
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
interface Clipboard {
	writeText(newClipText: string): Promise<void>;
	readText(): Promise<void>;
}

interface Navigator {
	// Only available in a secure context.
	readonly clipboard?: Clipboard;
}
