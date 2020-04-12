import {Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AttributeValue, CCEntity} from '../phaser/entities/cc-entity';

export abstract class AbstractWidget implements OnInit, OnChanges {
	@Input() key!: string;
	@Input() attribute!: AttributeValue;
	@Input() entity?: CCEntity;
	@Input() custom?: CCEntity;
	
	settings: any;
	
	ngOnInit() {
		this.ngOnChanges();
	}
	
	ngOnChanges(changes?: SimpleChanges): void {
		if (this.custom) {
			this.settings = this.custom;
		} else if (this.entity) {
			this.settings = this.entity.details.settings;
		} else {
			throw new Error('entity and custom settings not defined');
		}
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

	setSubSetting(keys: string[], value: any, updateType = true, parse = false) {
		if (parse) {
			value = JSON.parse(value);
		}
		let node = this.settings;
		for (let i = 0; i < keys.length - 1; i++) {
			node = node[keys[i]];
		}
		node[keys[keys.length - 1]] = value;
		if (updateType) {
			this.updateType();
		}
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
