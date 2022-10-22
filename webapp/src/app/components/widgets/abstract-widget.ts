import { Directive, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AttributeValue, CCEntity } from '../../services/phaser/entities/cc-entity';

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
	
	setSetting(key: string | string[], value: any, updateType = true, parse = false) {
		if (parse) {
			value = JSON.parse(value);
		}
		
		if (typeof key === 'string') {
			this.settings[key] = value;
		} else {
			let node = this.settings;
			for (let i = 0; i < key.length - 1; i++) {
				node = node[key[i]];
			}
			node[key[key.length - 1]] = value;
		}
		
		if (updateType) {
			this.updateType(value);
		}
	}
	
	updateType(value: any) {
		this.entity?.updateType();
		this.onChange.emit(value);
	}
}
