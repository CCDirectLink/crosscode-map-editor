import {Injectable} from '@angular/core';
import {StringWidgetComponent} from './string-widget/string-widget.component';

@Injectable()
export class WidgetRegistryService {
	private widgets: { [type: string]: any } = {};
	private defaultWidget: any;

	constructor() {
		this.register('String', StringWidgetComponent);
	}

	private setDefaultWidget(widget: any) {
		this.defaultWidget = widget;
	}

	private register(type: string, widget: any) {
		this.widgets[type] = widget;
	}

	public getDefaultWidget(): any {
		return this.defaultWidget;
	}

	public getWidget(type: string): any {
		if (this.hasWidget(type)) {
			return this.widgets[type];
		}
		return this.defaultWidget;
	}

	private hasWidget(type: string): boolean {
		return this.widgets.hasOwnProperty(type);
	}
}
