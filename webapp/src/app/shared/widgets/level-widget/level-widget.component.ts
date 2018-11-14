import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../models/cross-code-map';
import {MapLoaderService} from '../../map-loader.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-level-widget',
	templateUrl: './level-widget.component.html',
	styleUrls: ['./level-widget.component.scss', '../widget.scss']
})
export class LevelWidgetComponent extends AbstractWidget implements OnInit, OnDestroy, OnChanges {
	
	@Input() custom = null;
	@Input() displayName;
	settings;
	map;
	private subscription: Subscription;
	
	constructor(private maploader: MapLoaderService) {
		super();
		this.subscription = this.maploader.map.subscribe(map => this.map = map);
	}
	
	ngOnInit() {
		this.ngOnChanges(null);
	}
	
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		this.settings = this.custom || this.entity.details.settings;
	}
	
	setLevel(level: number) {
		this.settings[this.key].level = Number(level);
		this.entity.updateLevel();
	}
	
	setOffset(offset: number) {
		this.settings[this.key].offset = Number(offset);
		this.entity.updateLevel();
	}
	
}
