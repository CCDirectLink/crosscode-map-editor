import { inject, InjectionToken } from '@angular/core';
import { Globals } from './globals';
import { ElectronService } from './electron.service';
import { BrowserService } from './browser.service';

export interface SharedService {
    saveModSelect(mod: string): Promise<void>;
    getSelectedMod(): string;

    relaunch(): void;
}

export const SHARED_SERVICE = new InjectionToken<SharedService>('SharedService', {
	providedIn: 'root',
	factory: () => Globals.isElectron ? inject(ElectronService) : inject(BrowserService),
});
