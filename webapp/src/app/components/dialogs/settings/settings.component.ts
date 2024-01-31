import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BrowserService } from '../../../services/browser.service';
import { ElectronService } from '../../../services/electron.service';
import { Globals } from '../../../services/globals';
import { HttpClientService } from '../../../services/http-client.service';
import { AppSettings, SettingsService } from '../../../services/settings.service';
import { SharedService } from '../../../services/shared-service';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { PropListCard } from '../../widgets/shared/image-select-overlay/image-select-card/image-select-card.component';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	
	isElectron = Globals.isElectron;
	folderFormControl = new FormControl();
	icon = 'help_outline';
	iconCss = 'icon-undefined';
	mods: string[] = [];
	mod = '';
	settings: AppSettings;
	isIncludeVanillaMapsDisabled: boolean;
	
	cardLight: PropListCard = {
		name: 'Light',
		imgSrc: 'assets/selection-light.png',
	};
	
	cardDark: PropListCard = {
		name: 'Dark',
		imgSrc: 'assets/selection-dark.png',
	};
	
	private readonly sharedService: SharedService;
	
	constructor(
		private ref: OverlayRefControl,
		private electron: ElectronService,
		private browser: BrowserService,
		private settingsService: SettingsService,
		private snackBar: MatSnackBar,
		http: HttpClientService
	) {
		if (Globals.isElectron) {
			this.sharedService = electron;
		} else {
			this.sharedService = browser;
		}
		
		http.getMods().subscribe(mods => this.mods = mods);
		this.mod = this.sharedService.getSelectedMod();
		this.isIncludeVanillaMapsDisabled = !this.mod;
		this.settings = JSON.parse(JSON.stringify(this.settingsService.getSettings()));
	}
	
	ngOnInit() {
		if (this.isElectron) {
			this.folderFormControl.setValue(this.electron.getAssetsPath());
			this.folderFormControl.valueChanges.subscribe(() => this.resetIcon());
		}
		
		this.check();
	}
	
	private resetIcon() {
		this.icon = 'help_outline';
		this.iconCss = 'icon-undefined';
	}
	
	private setIcon(valid: boolean) {
		if (valid) {
			this.icon = 'check';
			this.iconCss = 'icon-valid';
		} else {
			this.icon = 'close';
			this.iconCss = 'icon-invalid';
		}
	}
	
	select() {
		const path = this.electron.selectCcFolder();
		if (path) {
			this.folderFormControl.setValue(path);
		}
	}
	
	check() {
		const valid = this.electron.checkAssetsPath(this.folderFormControl.value);
		this.setIcon(valid);
		if (valid) {
			this.folderFormControl.setErrors(null);
		} else {
			this.folderFormControl.setErrors({
				invalid: true
			});
		}
	}
	
	modSelectEvent(selectedMod: string) {
		this.isIncludeVanillaMapsDisabled = !selectedMod;
	}
	
	save() {
		if (this.isElectron) {
			this.electron.saveAssetsPath(this.folderFormControl.value);
		}
		this.sharedService.saveModSelect(this.mod);
		this.settingsService.updateSettings(this.settings);
		this.close();
		const ref = this.snackBar.open('Changing the path requires to restart the editor', 'Restart', {
			duration: 6000
		});
		
		ref.onAction().subscribe(() => this.sharedService.relaunch());
	}
	
	close() {
		this.ref.close();
	}
	
}
