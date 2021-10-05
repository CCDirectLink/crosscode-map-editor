import {Injectable} from '@angular/core';

@Injectable()
export class SettingsService {
	private static readonly wrapSettingName = 'wrapEventEditorLines';
	
	private static loadBooleanOrDefault(key: string, defaultValue: boolean): boolean {
		const loadedValue = localStorage.getItem(SettingsService.wrapSettingName);
		return loadedValue === null? defaultValue : (loadedValue === 'true');
	}
	
	get wrapEventEditorLines() {
		return SettingsService.loadBooleanOrDefault(SettingsService.wrapSettingName, true);
	}
	set wrapEventEditorLines(value: boolean) {
		localStorage.setItem(SettingsService.wrapSettingName, value.toString());
	}
}
