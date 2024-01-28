import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	private static readonly wrapSettingName = 'wrapEventEditorLines';
	private static readonly includeVanillaMapsSettingName = 'includeVanillaMaps';

	private static loadBooleanOrDefault(key: string, defaultValue: boolean): boolean {
		const loadedValue = localStorage.getItem(key);
		return loadedValue === null ? defaultValue : (loadedValue === 'true');
	}

	get wrapEventEditorLines() {
		return SettingsService.loadBooleanOrDefault(SettingsService.wrapSettingName, true);
	}
	set wrapEventEditorLines(value: boolean) {
		localStorage.setItem(SettingsService.wrapSettingName, value.toString());
	}

	get includeVanillaMaps() {
		return SettingsService.loadBooleanOrDefault(SettingsService.includeVanillaMapsSettingName, false);
	}
	set includeVanillaMaps(value: boolean) {
		localStorage.setItem(SettingsService.includeVanillaMapsSettingName, value.toString());
	}
}
