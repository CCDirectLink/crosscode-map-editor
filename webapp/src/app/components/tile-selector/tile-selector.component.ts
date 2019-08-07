import {Component, OnInit} from '@angular/core';
import * as Phaser from 'phaser';
import {TileSelectorScene} from './tile-selector.scene';
import {EditorView} from '../../models/editor-view';
import { EventService } from '../../services/event.service';
import { SettingsService } from '../../services/settings.service';
import { LoaderService } from '../../services/loader.service';


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
		private readonly settings: SettingsService,
		private readonly loader: LoaderService,
		private readonly events: EventService,
	) {
	}
	
	ngOnInit() {
		this.scene = new TileSelectorScene(this.settings, this.events);
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
		
		this.events.currentView.subscribe(view => this.hide = view !== EditorView.Layers);
	}
	
	onDragEnd() {
		if (!this.display || !this.scene) {
			return;
		}
		
		this.scene.resize();
	}
}
