import {
	animate, Component, Input, OnInit, style, transition, trigger, ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {MapLoaderService} from '../shared/map-loader.service';
import {CrossCodeMap, MapLayer} from '../shared/interfaces/cross-code-map';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../shared/phaser/tilemap/cc-map-layer';
import {EditorView} from '../shared/interfaces/editor-view';
import {GlobalEventsService} from '../shared/global-events.service';

@Component({
	selector: 'app-sidenav',
	animations: [
		trigger('transition', [
			transition(':enter', [
				style({opacity: 0}),
				animate('80ms', style({opacity: 1}))
			])
		])
	],
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

	selectedLayer: CCMapLayer;
	tilemap: CCMap;
	currentView: EditorView;
	editorViewEnum = EditorView;

	constructor(private mapLoader: MapLoaderService, private globalEvents: GlobalEventsService) {
	}

	ngOnInit() {
		this.mapLoader.selectedLayer.subscribe(layer => {
			if (layer) {
				this.selectedLayer = layer;
			}
		});
		this.mapLoader.tileMap.subscribe(tilemap => this.tilemap = tilemap);
		this.globalEvents.currentView.subscribe(view => this.currentView = view);

	}

	getDisplayName(layer: CCMapLayer): string {
		return `${layer.details.name} (${layer.details.level})`;
	}

	toggleVisibility(event, layer: CCMapLayer) {
		event.stopPropagation();
		layer.visible = !layer.visible;
	}

	selectLayer(layer: CCMapLayer) {
		this.mapLoader.selectedLayer.next(layer);
	}

	selectTab(view) {
		this.globalEvents.currentView.next(view);
	}
}
