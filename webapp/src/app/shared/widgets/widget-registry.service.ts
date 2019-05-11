import {Injectable} from '@angular/core';
import {StringWidgetComponent} from './string-widget/string-widget.component';
import {JsonWidgetComponent} from './json-widget/json-widget.component';
import {NumberWidgetComponent} from './number-widget/number-widget.component';
import {BooleanWidgetComponent} from './boolean-widget/boolean-widget.component';
import {Vec2WidgetComponent} from './vec2-widget/vec2-widget.component';
import {NPCStatesWidgetComponent} from './npc-states-widget/npc-states-widget.component';
import {EventWidgetComponent} from './event-widget/event-widget.component';
import {CharacterWidgetComponent} from './character-widget/character-widget.component';
import {PersonExpressionWidgetComponent} from './person-expression-widget/person-expression-widget.component'; 

@Injectable()
export class WidgetRegistryService {
	private widgets: { [type: string]: any } = {};
	private defaultWidget: any;

	constructor() {
		this.setDefaultWidget(JsonWidgetComponent);
		this.register('String', StringWidgetComponent);
		this.register('Number', NumberWidgetComponent);
		this.register('Integer', NumberWidgetComponent);
		this.register('Boolean', BooleanWidgetComponent);
		this.register('NPCStates', NPCStatesWidgetComponent);
		this.register('Vec2', Vec2WidgetComponent);
		this.register('Event', EventWidgetComponent);
		this.register('Character', CharacterWidgetComponent);
		this.register('PersonExpression', PersonExpressionWidgetComponent);
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
