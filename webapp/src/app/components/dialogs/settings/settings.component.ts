import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AssetsAccessService } from '../../../services/assets-access.service';
import { AppSettings, SettingsService } from '../../../services/settings.service';
import { SHARED_SERVICE } from '../../../services/shared-service';
import { ImageSelectCardComponent, PropListCard } from '../../widgets/shared/image-select-overlay/image-select-card/image-select-card.component';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { OverlayPanelComponent } from '../overlay/overlay-panel/overlay-panel.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatFormField, MatHint, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { ColoredTextDirective } from '../../../directives/colored-text.directive';
import { MatCheckbox } from '@angular/material/checkbox';

type AssetsStatus = 'unknown' | 'valid' | 'invalid';

const ASSETS_STATUS_DISPLAY: Record<AssetsStatus, { icon: string, iconCss: string, textCss: string, text: string }> = {
	unknown: { icon: 'help_outline', iconCss: 'icon-undefined', textCss: 'status-text', text: '' },
	valid: { icon: 'check_circle', iconCss: 'icon-valid', textCss: 'status-text', text: 'Valid CrossCode assets folder' },
	invalid: { icon: 'error', iconCss: 'icon-invalid', textCss: 'status-text-invalid', text: 'Not a CrossCode assets folder' },
};

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	imports: [
		OverlayPanelComponent,
		FlexModule,
		FormsModule,
		MatFormField,
		MatLabel,
		ReactiveFormsModule,
		MatHint,
		MatButton,
		MatIcon,
		ExtendedModule,
		MatSelect,
		MatOption,
		ColoredTextDirective,
		MatCheckbox,
		ImageSelectCardComponent,
	],
})
export class SettingsComponent {
	private ref = inject(OverlayRefControl);
	private settingsService = inject(SettingsService);
	private snackBar = inject(MatSnackBar);
	
	private readonly assetsAccess = inject(AssetsAccessService);
	private readonly pickedFolder = signal<{ handle: FileSystemDirectoryHandle, valid: boolean } | undefined>(undefined);
	readonly folderName = computed(() => (this.pickedFolder()?.handle ?? this.assetsAccess.handle())?.name ?? '');
	readonly assetsStatus = computed<AssetsStatus>(() => {
		const picked = this.pickedFolder();
		if (picked) {
			return picked.valid ? 'valid' : 'invalid';
		}
		// only valid folders get stored
		return this.assetsAccess.handle() ? 'valid' : 'unknown';
	});
	readonly assetsStatusDisplay = computed(() => ASSETS_STATUS_DISPLAY[this.assetsStatus()]);
	
	// TODO: fs-access
	readonly mods = signal<any[]>([]);
	
	mod = '';
	settings: AppSettings;
	
	cardLight: PropListCard = {
		name: 'Light',
		imgSrc: 'assets/selection-light.png',
	};
	
	cardDark: PropListCard = {
		name: 'Dark',
		imgSrc: 'assets/selection-dark.png',
	};
	
	private readonly sharedService = inject(SHARED_SERVICE);
	
	constructor() {
		this.mod = this.sharedService.getSelectedMod();
		
		this.settings = {} as AppSettings;
		for (const [key, val] of Object.entries(this.settingsService.signalSettings())) {
			this.settings[key as keyof AppSettings] = val();
		}
	}
	
	private async isAssetsFolder(handle: FileSystemDirectoryHandle) {
		const hasDir = (name: string) => handle.getDirectoryHandle(name).then(() => true, () => false);
		const [data, media] = await Promise.all([hasDir('data'), hasDir('media')]);
		return data && media;
	}
	
	async select() {
		const handle = await window.showDirectoryPicker();
		this.pickedFolder.set({ handle, valid: await this.isAssetsFolder(handle) });
	}
	
	async save() {
		const picked = this.pickedFolder();
		if (picked?.valid) {
			await this.assetsAccess.setHandle(picked.handle);
		}
		this.sharedService.saveModSelect(this.mod);
		
		const settings = this.settingsService.signalSettings();
		for (const [k, val] of Object.entries(this.settings)) {
			const key = k as keyof AppSettings;
			settings[key].set(val);
		}
		
		this.close();
		const ref = this.snackBar.open('Changing the path requires to restart the editor', 'Restart', {
			duration: 6000,
		});
		
		ref.onAction().subscribe(() => this.sharedService.relaunch());
	}
	
	close() {
		this.ref.close();
	}
	
}
