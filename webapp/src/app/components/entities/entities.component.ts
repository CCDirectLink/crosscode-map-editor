import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AttributeValue, CCEntity} from '../../renderer/phaser/entities/cc-entity';
import {CCMap} from '../../renderer/phaser/tilemap/cc-map';
import {HostDirective} from '../../renderer/host.directive';
import {AbstractWidget} from '../../renderer/widgets/abstract-widget';
import {WidgetRegistryService} from '../../renderer/widgets/widget-registry.service';
import {Vec2WidgetComponent} from '../../renderer/widgets/vec2-widget/vec2-widget.component';
import {LoaderService} from '../../services/loader.service';
import { EventService } from '../../services/event.service';

@Component({
	selector: 'app-entities',
	templateUrl: './entities.component.html',
	styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
	@ViewChild(HostDirective, {static: false}) appHost?: HostDirective;
	entity?: CCEntity;
	map?: CCMap;
	
	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private widgetRegistry: WidgetRegistryService,
		events: EventService
	) {
		events.selectedEntity.subscribe(e => {
			// clear focus of input fields to enable phaser inputs again
			(<HTMLElement>document.activeElement).blur();
			this.entity = e;
			this.loadSettings(e);
		});
		events.tileMap.subscribe(map => this.map = map);
	}
	
	ngOnInit() {
	}
	
	loadSettings(entity?: CCEntity) {
		if (!this.appHost) {
			return;
		}
		const ref = this.appHost.viewContainerRef;
		ref.clear();
		
		if (!entity) {
			return;
		}
		
		const def = entity.getScaleSettings();
		if (def && (def.scalableX || def.scalableY)) {
			const vec2Widget: Vec2WidgetComponent = <Vec2WidgetComponent>this.generateWidget(entity, 'size', {type: 'Vec2', description: ''}, ref);
			vec2Widget.enableX = def.scalableX;
			vec2Widget.enableY = def.scalableY;
			vec2Widget.step = def.scalableStep;
			vec2Widget.minSize = def.baseSize;
		}
		Object.entries(entity.getAttributes()).forEach(([key, val]) => {
			this.generateWidget(entity, key, val, ref);
		});
	}
	
	private generateWidget(entity: CCEntity, key: string, val: AttributeValue, ref: ViewContainerRef) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget(val.type));
		const componentRef = ref.createComponent(componentFactory);
		const instance = <AbstractWidget>componentRef.instance;
		instance.entity = entity;
		instance.key = key;
		instance.attribute = val;
		return instance;
	}
}
