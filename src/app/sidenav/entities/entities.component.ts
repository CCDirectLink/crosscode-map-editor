import {Component, OnInit} from '@angular/core';
import {CCEntity} from '../../shared/phaser/entities/cc-entity';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';

@Component({
	selector: 'app-entities',
	templateUrl: './entities.component.html',
	styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {

	entity: CCEntity;
	map: CCMap;

	constructor(private events: GlobalEventsService, private loader: MapLoaderService) {
		events.selectedEntity.subscribe(e => this.entity = e);
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

}
