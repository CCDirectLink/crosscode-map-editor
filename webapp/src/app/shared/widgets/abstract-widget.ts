import {Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CCEntity} from '../phaser/entities/cc-entity';

export abstract class AbstractWidget implements OnInit, OnChanges {
	@Input() key!: string;
	@Input() attribute: any;
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
	
	toInt(val: any): number {
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
