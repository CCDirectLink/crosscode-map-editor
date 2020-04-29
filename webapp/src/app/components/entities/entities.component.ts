import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AttributeValue, CCEntity} from '../../shared/phaser/entities/cc-entity';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {HostDirective} from '../../shared/host.directive';
import {AbstractWidget} from '../../shared/widgets/abstract-widget';
import {WidgetRegistryService} from '../../shared/widgets/widget-registry.service';
import {Vec2WidgetComponent} from '../../shared/widgets/vec2-widget/vec2-widget.component';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MapLoaderService} from '../../shared/map-loader.service';

@Component({
	selector: 'app-entities',
	templateUrl: './entities.component.html',
	styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
	@ViewChild(HostDirective, {static: false}) appHost?: HostDirective;
	entity?: CCEntity;
	map?: CCMap;
	filter = '';
	
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
		loader.tileMap.subscribe(map => {
			this.map = map;
			this.filter = '';
		});
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
			const vec2Widget: Vec2WidgetComponent = <Vec2WidgetComponent>this.generateWidget(entity, 'size', {
				type: 'Vec2',
				description: ''
			}, ref);
			vec2Widget.enableX = def.scalableX;
			vec2Widget.enableY = def.scalableY;
			vec2Widget.step = def.scalableStep;
			vec2Widget.minSize = def.baseSize;
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
