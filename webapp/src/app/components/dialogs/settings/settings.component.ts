import {AfterViewInit, Component, OnInit} from '@angular/core';
import {OverlayRefControl} from '../../../shared/overlay/overlay-ref-control';
import {ElectronService} from '../../../services/electron.service';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	
	folderFormControl = new FormControl();
	icon = 'help_outline';
	iconCss = 'icon-undefined';
	
	constructor(
		private ref: OverlayRefControl,
		private electron: ElectronService,
		private snackBar: MatSnackBar
	) {
	}
	
	ngOnInit() {
		this.folderFormControl.setValue(this.electron.getAssetsPath());
		this.folderFormControl.valueChanges.subscribe(() => this.resetIcon());
		
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
	
	save() {
		this.electron.saveAssetsPath(this.folderFormControl.value);
		this.close();
		const ref = this.snackBar.open('Changing the path requires to restart the editor', 'Restart', {
			duration: 6000
		});
		
		ref.onAction().subscribe(() => this.electron.relaunch());
	}
	
	close() {
		this.ref.close();
	}
	
}
