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
	settingKeys: string[];
	json = JSON;

	constructor(private events: GlobalEventsService, private loader: MapLoaderService) {
		events.selectedEntity.subscribe(e => {
			this.entity = e;
			if (!e) {
				return;
			}
			this.settingKeys = Object.keys(e.details.settings);
			// removes name, because it's already hardcoded
			this.settingKeys.shift();
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

	setSetting(value: string, key: string) {
		this.entity.details.settings[key] = JSON.parse(value);
		this.entity.updateType();
	}

}
