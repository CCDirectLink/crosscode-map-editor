import { Injectable } from '@angular/core';
import { Globals } from './globals';
import { SharedService } from './shared-service';

@Injectable({
	providedIn: 'root',
})
export class BrowserService implements SharedService {
	private static readonly modName = 'selectedMod';

	constructor() {
		if (Globals.isElectron) {
			return;
		}
	}

	public static async init(): Promise<void> {
		if (Globals.isElectron) {
			return;
		}

		const selectedMod = localStorage.getItem(this.modName) || '';

		try {
			await this.updateMod(selectedMod);
		} catch (ex) {
			console.error('Could not select mod: ', ex); //Don't crash when backend is not available
		}
	}

	private static async updateMod(mod: string): Promise<void> {
		//We cant use HttpClient because this is called really early
		await fetch(Globals.URL + 'api/select', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ mod }),
		});
	}

	public async saveModSelect(mod: string): Promise<void> {
		localStorage.setItem(BrowserService.modName, mod ?? '');
		await BrowserService.updateMod(mod);
	}

	public getSelectedMod(): string {
		return localStorage.getItem(BrowserService.modName) || '';
	}

	public relaunch(): void {
		location.reload();
	}
}
