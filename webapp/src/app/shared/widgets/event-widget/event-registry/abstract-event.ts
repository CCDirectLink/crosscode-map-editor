export interface EventType {
	type: string;
}

export abstract class AbstractEvent<T extends EventType> {
	
	public info = '---';
	public children: {
		title?: string,
		hideGreaterSign?: boolean
		events: AbstractEvent<any>[]
	}[] = [];
	
	constructor(public data: T) {
	}
	
	protected abstract generateNewDataInternal(): { [key: string]: any };
	
	public generateNewData() {
		const data = this.generateNewDataInternal();
		data.type = this.data.type;
		this.data = <any>data;
	}
	
	public abstract getAttributes(): { [key: string]: any };
	
	public abstract update();
	
	public export(): T {
		return JSON.parse(JSON.stringify(this.data));
	}
	
	protected combineStrings(...values): string {
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
			value = this.data[key];
		}
		const attr = this.getAttributes();
		if (attr && attr[key]) {
			const type = attr[key].type;
			if (type === 'Color') {
				value = this.getColorRectangle(value);
			} else if (type === 'Vec2') {
				value = this.getVec2String(value.x, value.y);
			} else if (type === 'Entity') {
				value = '[' + value.name + ']';
			}
		}
		return `<span style="color: #858585">${key}</span>: ${value}`;
	}
	
	protected getVec2String(x, y): string {
		return `(${x}, ${y})`;
	}
	
	protected getTypeString(color: string): string {
		return this.getBoldString(this.data.type, color);
	}
	
	protected getBoldString(text: string, color: string): string {
		return `<b style="color: ${color}">${text}</b>`;
	}
	
	protected getColoredString(text: string, color: string): string {
		return `<span style="color: ${color}">${text}</span>`;
	}
	
	protected getColorRectangle(color: string): string {
		return `<span style="background-color: ${color};">&nbsp &nbsp &nbsp &nbsp</span>`;
	}
}
