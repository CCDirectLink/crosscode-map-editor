import {EntityAttributes} from '../../../phaser/entities/cc-entity';
import {DomSanitizer} from '@angular/platform-browser';
import {SecurityContext} from '@angular/core';

export interface EventType {
	type: string;
}

export interface EventTypeChild {
	title?: string;
	hideGreaterSign?: boolean;
	events: AbstractEvent<any>[];
}

export abstract class AbstractEvent<T extends EventType> {
	
	public info = '---';
	public children: EventTypeChild[] = [];
	
	constructor(
		private domSanitizer: DomSanitizer,
		public data: T,
		public actionStep = false,
	) {
	}
	
	protected abstract generateNewDataInternal(): { [key: string]: any };
	
	public generateNewData() {
		const data = this.generateNewDataInternal();
		data.type = this.data.type;
		this.data = <any>data;
	}
	
	public abstract getAttributes(): EntityAttributes | undefined;
	
	public abstract update(): void;
	
	public export(): T {
		return JSON.parse(JSON.stringify(this.data));
	}
	
	protected combineStrings(...values: string[]): string {
		return values.join(' ');
	}
	
	protected getAllPropStrings(): string {
		const keys = Object.keys(this.data);
		return keys
			.filter(key => key !== 'type')
			.map(key => this.getPropString(key))
			.join(' ');
	}
	
	protected getPropString(key: string, value?: any): string {
		if (!value) {
			value = this.data[key as keyof T];
		}
		const attr = this.getAttributes();
		if (attr && attr[key]) {
			const type = attr[key].type;
			if (type === 'Color') {
				value = this.getColorRectangle(value);
			} else if (type === 'Vec2' && value) {
				value = this.getVec2String(value.x, value.y);
			} else if (type === 'Entity') {
				value = '[' + value.name + ']';
			}
		}
		return `<span style="color: #858585">${key}</span>: ${value}`;
	}
	
	protected getVec2String(x: number, y: number): string {
		return `(${this.sanitize(x)}, ${this.sanitize(y)})`;
	}
	
	protected getTypeString(color: string): string {
		color = this.sanitize(color);
		return this.getBoldString(this.data.type, color);
	}
	
	protected getBoldString(text: string, color: string): string {
		return `<b style="color: ${this.sanitize(color)}">${text}</b>`;
	}
	
	protected getColoredString(text: string, color: string): string {
		return `<span style="color: ${this.sanitize(color)}">${text}</span>`;
	}
	
	protected getColorRectangle(color: string): string {
		return `<span style="background-color: ${this.sanitize(color)};">&nbsp &nbsp &nbsp &nbsp</span>`;
	}
	
	private sanitize(val: string | number) {
		return this.domSanitizer.sanitize(SecurityContext.HTML, val) || '';
	}
}
