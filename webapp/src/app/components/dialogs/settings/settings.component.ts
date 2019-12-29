import {AfterViewInit, Component, OnInit} from '@angular/core';
import {OverlayRefControl} from '../../../shared/overlay/overlay-ref-control';
import {ElectronService} from '../../../services/electron.service';
import {ModloaderService} from '../../../services/modloader.service';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Globals} from '../../../shared/globals';
@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	
	isElectron = Globals.isElectron;
	folderFormControl = new FormControl();
	mapContextFormControl = new FormControl();
	icon = 'help_outline';
	iconCss = 'icon-undefined';
	mods: any[] = [{name: 'BASE'}]; 
	constructor(
		private ref: OverlayRefControl,
		private electron: ElectronService,
		private snackBar: MatSnackBar,
		private modloader: ModloaderService,
	) {
	}
	
	ngOnInit() {

		if (Globals.isElectron) {
			this.folderFormControl.setValue(this.electron.getAssetsPath());
			this.folderFormControl.valueChanges.subscribe(() => this.resetIcon());
		
			if (this.check()) {
				this.initMods();
			}
		} else {
			this.initMods();
		}

	}
	
	initMods() {
		this.mods.splice(1);

		this.modloader.getAllModsAssetsPath().subscribe(mods => this.mods.push(...mods));
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
			return true;
		} else {
			this.folderFormControl.setErrors({
				invalid: true
			});
			return false;
		}
	}
	
	save() {
		if (Globals.isElectron) {
			this.electron.saveAssetsPath(this.folderFormControl.value);
			const ref = this.snackBar.open('Changing the path requires to restart the editor', 'Restart', {
				duration: 6000
			});
			
			ref.onAction().subscribe(() => this.electron.relaunch());
		}
		this.close();
	}
	

	selectMod(index: number) {
		const mod = this.mods[index];
		Globals.globalEventsService.changeMapContext.next(mod);
	}

	close() {
		this.ref.close();
	}
	
}
