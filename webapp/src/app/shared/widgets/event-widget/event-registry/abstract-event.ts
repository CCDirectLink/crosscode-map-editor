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
	
	protected getPropString(key: string, value?: string): string {
		if (!value) {
			value = this.data[key];
		}
		return `<span style="color: #858585">${key}</span>: ${value}`;
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
}
