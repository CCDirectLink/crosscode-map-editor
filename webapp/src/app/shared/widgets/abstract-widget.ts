import {Input, OnChanges, OnInit, Directive, Output, EventEmitter} from '@angular/core';
import {AttributeValue, CCEntity} from '../phaser/entities/cc-entity';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractWidget implements OnInit, OnChanges {
	@Input() key!: string;
	@Input() attribute!: AttributeValue;
	@Input() entity?: CCEntity;
	@Input() custom?: CCEntity;

	@Output() onChange = new EventEmitter<any>();
	
	settings: any;
	
	ngOnInit() {
		this.ngOnChanges();
	}
	
	ngOnChanges(): void {
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
			this.updateType(value);
		}
	}
	
	updateType(value: any) {
		this.entity?.updateType();
		this.onChange.emit(value);
	}
}
