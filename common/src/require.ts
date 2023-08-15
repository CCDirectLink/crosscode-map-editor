export let fsPromise: Promise<typeof import('fs')>;
export let pathPromise: Promise<typeof import('path')>;


if (typeof window !== 'undefined' && 
	typeof navigator !== 'undefined' &&
	navigator.userAgent.indexOf('Electron') > -1) { 

	// Use electron require
	const remote = window['require']('@electron/remote');
	fsPromise = remote.require('fs');
	pathPromise = remote.require('path');
} else if (typeof process !== 'undefined' && !!globalThis['require']) {
	// Confuse webpack to not resolve import at compile time
	const fsPath = globalThis['doesNotMatter'] ? 'fs' : 'fs';
	const pathPath = globalThis['doesNotMatter'] ? 'path' : 'path';

	// Regular nodejs
	fsPromise = require(fsPath);
	pathPromise = require(pathPath);
} else if (typeof process !== 'undefined') {
	// Confuse webpack to not resolve import at compile time
	const fsPath = globalThis['doesNotMatter'] ? 'fs' : 'fs';
	const pathPath = globalThis['doesNotMatter'] ? 'path' : 'path';
	
	// Regular nodejs
	fsPromise = import(fsPath);
	pathPromise = import(pathPath);
} else {
	// Not a supported plattform. Return dummy, do not fail on execute of the lambda.
	fsPromise = Promise.resolve((() => new Proxy({}, {
		get() {
			throw new Error('This platform is not supported');
		},
		set() {
			throw new Error('This platform is not supported');
		}
	})) as unknown as typeof import('fs'));
	pathPromise = Promise.resolve((() => new Proxy({}, {
		get() {
			throw new Error('This platform is not supported');
		},
		set() {
			throw new Error('This platform is not supported');
		}
	})) as unknown as typeof import('path'));
}
