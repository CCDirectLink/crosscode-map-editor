import {Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CCEntity} from '../phaser/entities/cc-entity';

export abstract class AbstractWidget implements OnInit, OnChanges {
	@Input() key: string;
	@Input() attribute: any;
	@Input() entity: CCEntity;
	@Input() custom: CCEntity;
	
	settings;
	
	ngOnInit() {
		this.ngOnChanges(null);
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		this.settings = this.custom || this.entity.details.settings;
	}
	
	setSetting(key: string, value: any, updateType = true, parse = false) {
		if (parse) {
			value = JSON.parse(value);
		}
		this.settings[key] = value;
		if (updateType) {
			this.updateType();
		}
	}
	
	toInt(val) {
		return parseInt(val, 10);
	}
	
	updateSettings() {
		if (this.entity) {
			this.entity.updateSettings();
		}
	}
	
	updateType() {
		if (this.entity) {
			this.entity.updateType();
		}
	}
}
