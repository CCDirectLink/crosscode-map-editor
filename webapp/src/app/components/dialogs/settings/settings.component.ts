import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AssetsAccessService } from '../../../services/assets-access.service';
import { SettingsService } from '../../../services/settings.service';
import { ImageSelectCardComponent, PropListCard } from '../../widgets/shared/image-select-overlay/image-select-card/image-select-card.component';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { OverlayPanelComponent } from '../overlay/overlay-panel/overlay-panel.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ColoredTextDirective } from '../../../directives/colored-text.directive';

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
		ReactiveFormsModule,
		MatButton,
		MatIcon,
		ExtendedModule,
		MatCheckbox,
		MatSelectionList,
		MatListOption,
		ColoredTextDirective,
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
	
	private readonly availableMods = resource({
		params: () => this.assetsAccess.accessibleHandle(),
		loader: async () => {
			const [dlcs, mods] = await Promise.all([
				this.assetsAccess.getAllDlcs(),
				this.assetsAccess.getAllMods(),
			]);
			return { dlcs, mods };
		},
	});
	private readonly loadedMods = computed(() => this.availableMods.hasValue() ? this.availableMods.value() : undefined);
	readonly settings = this.settingsService.createDraft();
	private readonly dlcList = {
		title: 'DLC',
		emptyText: 'No DLC found',
		mods: computed(() => this.loadedMods()?.dlcs ?? []),
		selected: this.settings.selectedDlcs,
	};
	private readonly modList = {
		title: 'Mods',
		emptyText: 'No mods found',
		mods: computed(() => this.loadedMods()?.mods ?? []),
		selected: this.settings.selectedMods,
	};
	readonly modsLoading = this.availableMods.isLoading;
	readonly modLists = [this.dlcList, this.modList];
	
	cardLight: PropListCard = {
		name: 'Light',
		imgSrc: 'assets/selection-light.png',
	};
	
	cardDark: PropListCard = {
		name: 'Dark',
		imgSrc: 'assets/selection-dark.png',
	};
	
	private async isAssetsFolder(handle: FileSystemDirectoryHandle) {
		const hasDir = (name: string) => handle.getDirectoryHandle(name).then(() => true, () => false);
		const [data, media] = await Promise.all([hasDir('data'), hasDir('media')]);
		return data && media;
	}
	
	async select() {
		const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
		this.pickedFolder.set({ handle, valid: await this.isAssetsFolder(handle) });
	}
	
	async save() {
		const picked = this.pickedFolder();
		if (picked?.valid) {
			await this.assetsAccess.setHandle(picked.handle);
		}
		this.settingsService.applyDraft(this.settings);
		
		this.close();
		const ref = this.snackBar.open('Changing the path requires to restart the editor', 'Restart', {
			duration: 6000,
		});
		
		ref.onAction().subscribe(() => location.reload());
	}
	
	close() {
		this.ref.close();
	}
	
}
