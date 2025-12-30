import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AttributeValue } from '../../../../services/phaser/entities/cc-entity';
import { AbstractWidget } from '../../abstract-widget';
import { OverlayPanelComponent } from '../../../dialogs/overlay/overlay-panel/overlay-panel.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { EnemySingleTypeWidgetComponent } from '../../enemy-single-type-widget/enemy-single-type-widget.component';
import { StringWidgetComponent } from '../../string-widget/string-widget.component';
import { JsonWidgetComponent } from '../../json-widget/json-widget.component';
import { BooleanWidgetComponent } from '../../boolean-widget/boolean-widget.component';
import { NumberWidgetComponent } from '../../number-widget/number-widget.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-enemy-type-overlay',
    templateUrl: './enemy-type-overlay.component.html',
    styleUrls: ['./enemy-type-overlay.component.scss', '../../widget.scss'],
    imports: [OverlayPanelComponent, FlexModule, EnemySingleTypeWidgetComponent, StringWidgetComponent, JsonWidgetComponent, BooleanWidgetComponent, NumberWidgetComponent, MatButton]
})
export class EnemyTypeWidgetOverlayComponent extends AbstractWidget implements OnInit {
	@Output() exit = new EventEmitter<void>();
	
	readonly partyOptions = [
		'PLAYER',
		'ENEMY',
		'OTHER'
	];
	readonly partyAttributes: AttributeValue = {
		type: 'String',
		description: '',
		withNull: true,
		options: this.makeOptions(this.partyOptions)
	};
	readonly faceOptions = [
		'NORTH',
		'EAST',
		'SOUTH',
		'WEST',
		'NORTH_EAST',
		'SOUTH_EAST',
		'SOUTH_WEST',
		'NORTH_WEST'
	];
	readonly faceAttributes: AttributeValue = {
		type: 'String',
		description: '',
		withNull: true,
		options: this.makeOptions(this.faceOptions)
	};
	
	private makeOptions(options: string[]) {
		const out: { [key: string]: 0 } = {};
		for (const opt of options) {
			out[opt] = 0;
		}
		return out;
	}
	
	constructor() {
		super();
	}
	
	override ngOnInit() {
		super.ngOnInit();
		if (!this.settings[this.key]) {
			this.settings[this.key] = {};
		}
	}
	
	close() {
		this.exit.emit();
	}
	
	stringify(arg: unknown): string {
		return JSON.stringify(arg);
	}
	
	parse(arg: string): unknown {
		try {
			return JSON.parse(arg);
		} catch (err) {
			console.warn(err);
			return undefined;
		}
	}
}
