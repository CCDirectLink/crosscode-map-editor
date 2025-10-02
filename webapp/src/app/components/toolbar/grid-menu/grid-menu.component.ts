import { Component, effect, OnInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Globals } from '../../../services/globals';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { PointInputComponent } from '../vec-input/point-input.component';
import { Helper } from '../../../services/phaser/helper';
import { Point } from '../../../models/cross-code-map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GlobalEventsService } from '../../../services/global-events.service';

export interface GridSettings {
	size: Point;
	offset: Point;
	color: string;
	enableGrid: boolean;
	showSettings?: boolean;
	visible?: boolean;
}

const gridSettingsKey = 'gridSettingsKey';

@Component({
	selector: 'app-grid-menu',
	animations: [
		trigger('openClose', [
			state('void', style({
				width: '0',
				margin: '0'
			})),
			transition('* <=> *', [
				animate('100ms ease'),
			]),
		])
	],
	imports: [
		MatCheckbox,
		MatIconButton,
		MatIcon,
		FormsModule,
		NgIf,
		MatFormField,
		MatLabel,
		PointInputComponent
	],
	templateUrl: './grid-menu.component.html',
	styleUrl: './grid-menu.component.scss'
})
export class GridMenuComponent implements OnInit {
	
	gridSettings = Globals.gridSettings;
	
	constructor(
		events: GlobalEventsService
	) {
		effect(() => {
			const settings = this.gridSettings();
			localStorage.setItem(gridSettingsKey, JSON.stringify(settings));
			events.gridSettings.next(settings);
		});
	}
	
	ngOnInit() {
		try {
			const settings = JSON.parse(localStorage.getItem(gridSettingsKey)!) as Partial<GridSettings>;
			Globals.gridSettings.update(old => ({
				...old,
				...settings
			}));
		} catch (e) {
		}
	}
	
	update(newSettings: Partial<GridSettings>) {
		Globals.gridSettings.update(old => {
			const cpy = Helper.copy(old);
			Object.assign(cpy, newSettings);
			return cpy;
		});
	}
	
	protected readonly MatCheckbox = MatCheckbox;
	
	toggleSettings() {
		Globals.gridSettings.update(old => ({
			...old,
			showSettings: !old.showSettings
		}));
	}
}
