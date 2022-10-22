import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BabylonViewer } from '../../services/3d/BabylonViewer';
import { GlobalEventsService } from '../../services/global-events.service';
import { Globals } from '../../services/globals';

@Component({
	selector: 'app-babylon',
	templateUrl: './babylon.component.html',
	styleUrls: ['./babylon.component.scss']
})
export class BabylonComponent implements OnInit, AfterViewInit, OnDestroy {
	
	@ViewChild('renderCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
	
	private sub: Subscription;
	private viewer: BabylonViewer;
	
	loading = false;
	
	constructor(
		private router: Router,
		private globalEvents: GlobalEventsService
	) {
		this.sub = globalEvents.babylonLoading.subscribe(val => this.loading = val);
		this.viewer = new BabylonViewer(globalEvents);
	}
	
	ngOnInit() {
		// if phaser is not initialized, move away from 3d
		if (!Globals.scene.cameras) {
			this.router.navigate(['/']);
			return;
		}
		this.globalEvents.babylonLoading.next(true);
		this.globalEvents.is3D.next(true);
	}
	
	ngAfterViewInit() {
		if (Globals.scene.cameras) {
			// timeout needed because babylon would initialize with wrong width/height and would need a resize
			setTimeout(async () => {
				await this.viewer.init(this.canvas.nativeElement);
			}, 0);
		}
	}
	
	ngOnDestroy() {
		this.viewer.onDestroy();
		this.sub.unsubscribe();
		this.globalEvents.is3D.next(false);
	}
	
}
