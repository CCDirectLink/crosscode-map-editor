import { effect, Injectable, signal, WritableSignal } from '@angular/core';

export type Signalify<T> = {
	[K in keyof T]: WritableSignal<T[K]>;
};

export interface AppSettings {
	wrapEventEditorLines: boolean;
	selectionBoxDark: boolean;
	selectedDlcs: string[];
	selectedMods: string[];
}

@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	
	private readonly settings: Signalify<AppSettings> = {
		wrapEventEditorLines: this.loadOrDefault('wrapEventEditorLines', true),
		selectionBoxDark: this.loadOrDefault('selectionBoxDark', true),
		selectedDlcs: this.loadOrDefault('selectedDlcs', []),
		selectedMods: this.loadOrDefault('selectedMods', []),
	};
	
	constructor() {
		for (const [key, val] of Object.entries(this.settings)) {
			effect(() => {
				localStorage.setItem(key, JSON.stringify(val()));
			});
		}
	}
	
	signalSettings(): Signalify<AppSettings> {
		return this.settings;
	}
	
	createDraft(): Signalify<AppSettings> {
		const draft: Record<string, WritableSignal<unknown>> = {};
		for (const [key, val] of Object.entries(this.settings)) {
			draft[key] = signal(val());
		}
		return draft as Signalify<AppSettings>;
	}
	
	applyDraft(draft: Signalify<AppSettings>) {
		const settings: Record<string, WritableSignal<unknown>> = this.settings;
		for (const [key, val] of Object.entries(draft)) {
			settings[key].set(val());
		}
	}
	
	private loadOrDefault<K extends keyof AppSettings>(key: K, defaultValue: AppSettings[K]): WritableSignal<AppSettings[K]> {
		const loadedValue = localStorage.getItem(key);
		let val = defaultValue;
		if (loadedValue !== null) {
			try {
				val = JSON.parse(loadedValue);
			} catch (e) {
				console.error(`Invalid value for setting ${key}`, e);
			}
		}
		return signal(val);
	}
}
