import {AfterViewInit, Component, HostListener} from '@angular/core';
import * as Phaser from 'phaser';
import {TileSelectorScene} from './tile-selector.scene';
import {GlobalEventsService} from '../../shared/global-events.service';
import {EditorView} from '../../models/editor-view';
import {Globals} from '../../shared/globals';
import {NavigationStart, Router} from '@angular/router';


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
		router: Router
	) {
		globalEvents.currentView.subscribe(view => this.hide = view !== EditorView.Layers);
		
		// TODO: floating windows should be handled globally
		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.hide = event.url === '/3d';
			}
		});
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

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		if (!this.display) {
			return;
		}
		this.display.scale.refresh();
	}

	onDragEnd() {
		if (!this.display || !this.scene) {
			return;
		}
		
		this.scene.resize();
	}
}
