import { Injectable } from '@angular/core';

export interface AppSettings {
	wrapEventEditorLines: boolean;
	includeVanillaMaps: boolean;
	selectionBoxDark: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	
	private settings: AppSettings = {
		wrapEventEditorLines: this.loadBooleanOrDefault('wrapEventEditorLines', true),
		includeVanillaMaps: this.loadBooleanOrDefault('includeVanillaMaps', false),
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
