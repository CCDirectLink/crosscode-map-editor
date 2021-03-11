import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractWidget} from '../../abstract-widget';

@Component({
	selector: 'app-enemy-type-overlay',
	templateUrl: './enemy-type-overlay.component.html',
	styleUrls: ['./enemy-type-overlay.component.scss', '../../widget.scss']
})
export class EnemyTypeWidgetOverlayComponent extends AbstractWidget implements OnInit {
	@Output() exit = new EventEmitter<void>();

	readonly partyOptions = [
		'PLAYER',
		'ENEMY',
		'OTHER'
	];
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

	constructor() {
		super();
	}
	
	ngOnInit() {
		super.ngOnInit();
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
