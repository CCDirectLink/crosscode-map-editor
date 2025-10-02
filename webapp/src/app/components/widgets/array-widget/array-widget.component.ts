import { Component, OnChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { NgComponentOutlet } from '@angular/common';
import { AttributeValue } from '../../../services/phaser/entities/cc-entity';
import { WidgetRegistryService } from '../widget-registry.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export interface ArrayWidgetSub {
	_type: string;
	_popup?: boolean;
	_select?: Record<string, number>;
}

export interface ArrayAttributes extends AttributeValue {
	sub: ArrayWidgetSub;
}

interface ArraySettings {
	[key: string]: unknown[] | undefined;
}

interface DynamicComponent {
	comp: Type<AbstractWidget>;
	inputs: Partial<AbstractWidget>;
}

@Component({
	selector: 'app-array-widget',
	imports: [
		FlexModule,
		ReactiveFormsModule,
		MatTooltip,
		NgComponentOutlet,
		MatIconButton,
		MatIcon
	],
	templateUrl: './array-widget.component.html',
	styleUrls: ['./array-widget.component.scss', '../widget.scss']
})
export class ArrayWidgetComponent extends AbstractWidget<ArraySettings, ArrayAttributes> implements OnChanges {
	
	@ViewChild('compContainer', {read: ViewContainerRef, static: true}) compContainer!: ViewContainerRef;
	
	dynamicComponents: DynamicComponent[] = [];
	
	constructor(
		private widgetRegistry: WidgetRegistryService,
	) {
		super();
	}
	
	
	override ngOnChanges() {
		super.ngOnChanges();
		this.init();
	}
	
	override updateType(value: any) {
		super.updateType(value);
		this.init();
	}
	
	init() {
		this.dynamicComponents = [];
		const arrayOptions = this.settings[this.key] ?? [];
		this.settings[this.key] = arrayOptions;
		const len = arrayOptions.length;
		for (let i = 0; i < len; i++) {
			this.dynamicComponents.push({
				comp: this.widgetRegistry.getWidget(this.attribute.sub._type),
				inputs: {
					custom: arrayOptions,
					key: i.toString(),
					attribute: {
						type: this.attribute.sub._type,
						description: '',
						options: this.attribute.sub._select
					},
					changeVal: val => this.update()
				}
			});
		}
	}
	
	remove(index: number) {
		this.settings[this.key]?.splice(index, 1);
		this.update();
	}
	
	add() {
		this.settings[this.key]?.push(undefined);
		this.update();
	}
	
	private update() {
		this.updateType(this.settings[this.key]);
	}
}
