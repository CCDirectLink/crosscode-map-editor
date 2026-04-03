import { effect, Injectable, signal, WritableSignal } from '@angular/core';

export type Signalify<T> = {
	[K in keyof T]: WritableSignal<T[K]>;
};

export interface AppSettings {
	wrapEventEditorLines: boolean;
	selectionBoxDark: boolean;
	showVanillaMaps: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	
	private readonly settings: Signalify<AppSettings> = {
		wrapEventEditorLines: this.loadBooleanOrDefault('wrapEventEditorLines', true),
		selectionBoxDark: this.loadBooleanOrDefault('selectionBoxDark', true),
		showVanillaMaps: this.loadBooleanOrDefault('showVanillaMaps', false),
	};
	
	constructor() {
		for (const [key, val] of Object.entries(this.settings)) {
			effect(() => {
				localStorage.setItem(key, val().toString());
			});
		}
	}
	
	/**
	 * @deprecated Use signalSettings instead.
	 */
	getSettings(): Readonly<AppSettings> {
		const out = {} as AppSettings;
		for (const [key, val] of Object.entries(this.settings)) {
			out[key as keyof AppSettings] = val();
		}
		return out;
	}
	
	signalSettings(): Signalify<AppSettings> {
		return this.settings;
	}
	
	private loadBooleanOrDefault(key: keyof AppSettings, defaultValue: boolean): WritableSignal<boolean> {
		const loadedValue = localStorage.getItem(key);
		const val = loadedValue === null ? defaultValue : (loadedValue === 'true');
		return signal(val);
	}
	
	/**
	 * @deprecated set signals directly instead
	 */
	public updateSettings(newSettings: Partial<AppSettings>) {
		for (const [k, val] of Object.entries(newSettings)) {
			const key = k as keyof AppSettings;
			this.settings[key].set(val);
		}
	}
}
