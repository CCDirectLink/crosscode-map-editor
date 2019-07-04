import {Component, OnInit} from '@angular/core';
import * as Phaser from 'phaser';
import {MapLoaderService} from '../../shared/map-loader.service';
import {HttpClientService} from '../../services/http-client.service';
import {TileSelectorScene} from './tile-selector.scene';
import {GlobalEventsService} from '../../shared/global-events.service';
import {EditorView} from '../../models/editor-view';


@Component({
	selector: 'app-tile-selector',
	templateUrl: './tile-selector.component.html',
	styleUrls: ['./tile-selector.component.scss']
})
export class TileSelectorComponent implements OnInit {
	private display?: Phaser.Game;
	private scene?: TileSelectorScene;
	hide = false;
	
	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService,
		private globalEvents: GlobalEventsService) {
	}
	
	ngOnInit() {
		this.scene = new TileSelectorScene();
		this.display = new Phaser.Game({
			width: 400 * window.devicePixelRatio,
			height: 1200 * window.devicePixelRatio,
			type: Phaser.AUTO,
			parent: 'tile-selector-content',
			scale: {
				mode: Phaser.Scale.ScaleModes.NONE,
				zoom: 1 / window.devicePixelRatio
			},
			render: {
				pixelArt: true
			},
			zoom: 1,
			scene: [this.scene]
		});
		
		this.globalEvents.currentView.subscribe(view => this.hide = view !== EditorView.Layers);
	}
	
	onDragEnd() {
		if (!this.display || !this.scene) {
			return;
		}
		
		this.scene.resize();
	}
}
