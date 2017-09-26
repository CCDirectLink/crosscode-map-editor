import {Input} from '@angular/core';
import {CCEntity} from '../../../shared/phaser/entities/cc-entity';

export abstract class AbstractWidget {
	@Input() key: string;
	@Input() entity: CCEntity;

	setSetting(key: string, value: string, updateType = true, parse = false) {
		if (parse) {
			value = JSON.parse(value);
		}
		this.entity.details.settings[key] = value;
		if (updateType) {
			this.updateType();
		}
	}

	toInt(val) {
		return parseInt(val, 10);
	}

	updateSettings() {
		this.entity.updateSettings();
	}

	updateType() {
		this.entity.updateType();
	}
}
