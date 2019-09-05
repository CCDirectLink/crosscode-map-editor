import {AfterViewInit, Component} from '@angular/core';
import * as Phaser from 'phaser';
import {TileSelectorScene} from './tile-selector.scene';
import {GlobalEventsService} from '../../shared/global-events.service';
import {EditorView} from '../../models/editor-view';


@Component({
	selector: 'app-tile-selector',
	templateUrl: './tile-selector.component.html',
	styleUrls: ['./tile-selector.component.scss']
})
export class TileSelectorComponent implements AfterViewInit {
	private display?: Phaser.Game;
	private scene?: TileSelectorScene;
	hide = false;
	
	constructor(
		globalEvents: GlobalEventsService,
	) {
		globalEvents.currentView.subscribe(view => this.hide = view !== EditorView.Layers);
	}
	
	ngAfterViewInit() {
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
	}
	
	onDragEnd() {
		if (!this.display || !this.scene) {
			return;
		}
		
		this.scene.resize();
	}
}
