import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared-service';
import { Globals } from './globals';
import { ElectronService } from './electron.service';
import { BrowserService } from './browser.service';

export interface AppSettings {
	wrapEventEditorLines: boolean;
	selectionBoxDark: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	
	public readonly sharedService: SharedService;
	
	constructor() {
		if (Globals.isElectron) {
			this.sharedService = inject(ElectronService);
		} else {
			this.sharedService = inject(BrowserService);
		}
	}
	
	private settings: AppSettings = {
		wrapEventEditorLines: this.loadBooleanOrDefault('wrapEventEditorLines', true),
		selectionBoxDark: this.loadBooleanOrDefault('selectionBoxDark', true),
	};
	
	getSettings(): Readonly<AppSettings> {
		return this.settings;
	}
	
	private loadBooleanOrDefault(key: keyof AppSettings, defaultValue: boolean): boolean {
		const loadedValue = localStorage.getItem(key);
		return loadedValue === null ? defaultValue : (loadedValue === 'true');
	}
	
	public updateSettings(newSettings: Partial<AppSettings>) {
		this.settings = {
			...this.settings,
			...newSettings
		};
		for (const [key, value] of Object.entries(this.settings)) {
			localStorage.setItem(key, (value as boolean).toString());
		}
	}
}
