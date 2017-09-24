import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CCEntity} from '../../shared/phaser/entities/cc-entity';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {HostDirective} from '../../shared/host.directive';
import {AbstractWidget} from './widgets/abstract-widget';
import {WidgetRegistryService} from './widgets/widget-registry.service';
import {EntityDefinition} from '../../shared/interfaces/entity-definition';
import {Vec2WidgetComponent} from './widgets/vec2-widget/vec2-widget.component';

@Component({
	selector: 'app-entities',
	templateUrl: './entities.component.html',
	styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
	@ViewChild(HostDirective) appHost: HostDirective;
	entity: CCEntity;
	map: CCMap;

	constructor(private events: GlobalEventsService,
				private loader: MapLoaderService,
				private componentFactoryResolver: ComponentFactoryResolver,
				private widgetRegistry: WidgetRegistryService) {
		events.selectedEntity.subscribe(e => {
			this.entity = e;
			this.loadSettings(e);
		});
		loader.tileMap.subscribe(map => this.map = map);
	}

	ngOnInit() {
	}

	setLevel(level: number) {
		this.entity.details.level.level = Number(level);
		this.entity.updateLevel();
	}

	setOffset(offset: number) {
		this.entity.details.level.offset = Number(offset);
		this.entity.updateLevel();
	}

	loadSettings(entity: CCEntity) {
		console.log(entity);
		if (!this.appHost) {
			return;
		}
		const ref = this.appHost.viewContainerRef;
		ref.clear();

		if (!entity) {
			return;
		}

		const def: EntityDefinition = entity.definition;
		if (def.resizable) {
			const vec2Widget: Vec2WidgetComponent = <Vec2WidgetComponent>this.generateWidget(entity, 'size', {type: 'Vec2'}, ref);
			if (def.type === 'ScalableProp') {
				vec2Widget.enableX = entity.entitySettings.scalableX;
				vec2Widget.enableY = entity.entitySettings.scalableY;
				vec2Widget.step = entity.entitySettings.scalableStep;
				vec2Widget.minSize = entity.entitySettings.baseSize;
			}
		}
		Object.entries(def.attributes).forEach(([key, val]) => {
			this.generateWidget(entity, key, val, ref);
		});
	}

	private generateWidget(entity: CCEntity, key: string, val, ref: ViewContainerRef) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget(val.type));
		const componentRef = ref.createComponent(componentFactory);
		const instance = <AbstractWidget> componentRef.instance;
		instance.entity = entity;
		instance.key = key;
		return instance;
	}
}
