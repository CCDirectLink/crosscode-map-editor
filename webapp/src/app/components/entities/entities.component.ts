import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { HostDirective } from '../../directives/host.directive';
import { GlobalEventsService } from '../../services/global-events.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { AttributeValue, CCEntity } from '../../services/phaser/entities/cc-entity';
import { CCMap } from '../../services/phaser/tilemap/cc-map';
import { AbstractWidget } from '../widgets/abstract-widget';
import { Vec2WidgetComponent } from '../widgets/vec2-widget/vec2-widget.component';
import { WidgetRegistryService } from '../widgets/widget-registry.service';

@Component({
	selector: 'app-entities',
	templateUrl: './entities.component.html',
	styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent {
	@ViewChild(HostDirective, {static: false}) appHost?: HostDirective;
	entity?: CCEntity;
	map?: CCMap;
	filter = '';
	hideFilter = false;
	
	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private widgetRegistry: WidgetRegistryService,
		private events: GlobalEventsService,
		loader: MapLoaderService
	) {
		events.selectedEntity.subscribe(e => {
			// clear focus of input fields to enable phaser inputs again ONLY if not a canvas
			if (document.activeElement && document.activeElement.tagName !== 'CANVAS') {
				(<HTMLElement>document.activeElement).blur();
			}
			this.entity = e;
			this.loadSettings(e);
		});
		events.is3D.subscribe(is3d => this.hideFilter = is3d);
		loader.tileMap.subscribe(map => {
			this.map = map;
			this.filter = '';
		});
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
			const vec2Widget: Vec2WidgetComponent = <Vec2WidgetComponent>this.generateWidget(
				entity,
				'size', {
					type: 'Vec2',
					description: ''
				},
				ref
			);
			vec2Widget.def = def;
		}
		Object.entries(entity.getAttributes()).forEach(([key, val]) => {
			this.generateWidget(entity, key, val, ref);
		});
	}
	
	updateFilter() {
		this.events.filterEntity.next(this.filter);
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
