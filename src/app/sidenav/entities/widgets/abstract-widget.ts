import {Input} from '@angular/core';
import {CCEntity} from '../../../shared/phaser/entities/cc-entity';

export abstract class AbstractWidget {
	@Input() key: string;
	@Input() value: any;
	@Input() entity: CCEntity;
	@Input() settings: any;

	updateSettings() {
		this.entity.updateSettings();
	}

	updateType() {
		this.entity.updateType();
	}
}
