import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-enemy-type-widget',
	templateUrl: './enemy-type-widget.component.html',
	styleUrls: ['./enemy-type-widget.component.scss', '../widget.scss']
})
export class EnemyTypeWidgetComponent extends AbstractWidget implements OnInit {
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
	]

	constructor() {
		super();
	}
	
	ngOnInit() {
		super.ngOnInit();
	}
}