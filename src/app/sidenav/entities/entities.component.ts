import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {CCEntity} from '../../shared/phaser/entities/cc-entity';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {HostDirective} from '../../shared/host.directive';
import {AbstractWidget} from './widgets/abstract-widget';
import {WidgetRegistryService} from './widgets/widget-registry.service';

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
			if (!e) {
				if (this.appHost) {
					this.appHost.viewContainerRef.clear();
				}
				return;
			}
			this.loadSettings();
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

	loadSettings() {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget('String'));
		const viewContainerRef = this.appHost.viewContainerRef;
		viewContainerRef.clear();

		const componentRef = viewContainerRef.createComponent(componentFactory);
		const instance = <AbstractWidget> componentRef.instance;
		instance.entity = this.entity;
		instance.key = 'dynamic widget';
	}
}
