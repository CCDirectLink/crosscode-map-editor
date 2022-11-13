import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrossCodeMap } from '../../../models/cross-code-map';
import { MapLoaderService } from '../../../services/map-loader.service';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-level-widget',
	templateUrl: './level-widget.component.html',
	styleUrls: ['./level-widget.component.scss', '../widget.scss']
})
export class LevelWidgetComponent extends AbstractWidget implements OnInit, OnDestroy, OnChanges {
	
	@Input() displayName = '';
	map?: CrossCodeMap;
	private subscription: Subscription;
	
	constructor(private maploader: MapLoaderService) {
		super();
		this.subscription = this.maploader.map.subscribe(map => this.map = map);
	}
	
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
	
	setLevel(level: number) {
		this.settings[this.key].level = Number(level);
		if (this.entity) {
			this.entity.updateLevel();
		}
		this.updateType(level);
	}
	
	setOffset(offset: number) {
		this.settings[this.key].offset = Number(offset);
		if (this.entity) {
			this.entity.updateLevel();
		}
		this.updateType(offset);
	}
	
}
