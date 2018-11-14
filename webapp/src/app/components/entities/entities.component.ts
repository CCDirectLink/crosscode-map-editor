import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CCEntity} from '../../shared/phaser/entities/cc-entity';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {HostDirective} from '../../shared/host.directive';
import {AbstractWidget} from '../../shared/widgets/abstract-widget';
import {WidgetRegistryService} from '../../shared/widgets/widget-registry.service';
import {Vec2WidgetComponent} from '../../shared/widgets/vec2-widget/vec2-widget.component';

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
			// clear focus of input fields to enable phaser inputs again
			(<HTMLElement>document.activeElement).blur();
			this.entity = e;
			this.loadSettings(e);
		});
		loader.tileMap.subscribe(map => this.map = map);
	}

	ngOnInit() {
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

		const def = entity.getScaleSettings();
		if (def && (def.scalableX || def.scalableY)) {
			const vec2Widget: Vec2WidgetComponent = <Vec2WidgetComponent>this.generateWidget(entity, 'size', {type: 'Vec2'}, ref);
			vec2Widget.enableX = def.scalableX;
			vec2Widget.enableY = def.scalableY;
			vec2Widget.step = def.scalableStep;
			vec2Widget.minSize = def.baseSize;
			// TODO implement scalable prop then delete this
			/*if (def.type === 'ScalableProp') {
				vec2Widget.enableX = entity.entitySettings.scalableX;
				vec2Widget.enableY = entity.entitySettings.scalableY;
				vec2Widget.step = entity.entitySettings.scalableStep;
				vec2Widget.minSize = entity.entitySettings.baseSize;
			} else {
				vec2Widget.enableX = def.scalableX;
				vec2Widget.enableY = def.scalableY;
				vec2Widget.minSize = entity.entitySettings.baseSize;
			}*/
		}
		Object.entries(entity.getAttributes()).forEach(([key, val]) => {
			this.generateWidget(entity, key, val, ref);
		});
	}

	private generateWidget(entity: CCEntity, key: string, val, ref: ViewContainerRef) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget(val.type));
		const componentRef = ref.createComponent(componentFactory);
		const instance = <AbstractWidget> componentRef.instance;
		instance.entity = entity;
		instance.key = key;
		instance.attribute = val;
		return instance;
	}
}
