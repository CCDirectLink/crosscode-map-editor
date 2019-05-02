let result: NodeRequireFunction | (() => null);

if (!!module['require']) {
    try {
        const electron = window['require']('electron');
        // Use electron require
        result = electron.remote.require('fs');
    } catch {
        // Regular nodejs
        result = module['require'];
    }
} else {
    // Not a supported plattform. Return dummy
    result = () => null;
}

export const requireLocal = result;
