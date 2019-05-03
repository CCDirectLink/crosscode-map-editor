let result: NodeRequireFunction | (() => null);

if (typeof window !== 'undefined' && 
	typeof navigator !== 'undefined' &&
	navigator.userAgent.indexOf('Electron') > -1) { 

	const electron = window['require']('electron');
	// Use electron require
	result = electron.remote.require;
} else if (typeof process !== 'undefined' && process.versions.node) {
	// Regular nodejs
	result = module['require'];
} else {
	// Not a supported plattform. Return dummy
	result = () => null;
}

export const requireLocal = result;
