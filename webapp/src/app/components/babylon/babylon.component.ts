import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
	ArcRotateCamera,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Path2,
	PolygonMeshBuilder,
	Scene,
	Vector3
} from '@babylonjs/core';

import * as earcut from 'earcut';
import {CustomFreeCamera} from './camera/custom-free-camera';

@Component({
	selector: 'app-babylon',
	templateUrl: './babylon.component.html',
	styleUrls: ['./babylon.component.scss']
})
export class BabylonComponent implements OnInit, AfterViewInit {

	@ViewChild('renderCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		// timeout needed because babylon would initialize with wrong width/height and would need a resize
		setTimeout(() => this.initBabylon(), 0);
	}

	initBabylon() {
		const engine = new Engine(this.canvas.nativeElement);
		const scene = new Scene(engine);

		const cam = new CustomFreeCamera('camera', new Vector3(0, 0, -4), scene);
		cam.position.y = 1;
		cam.speed = 0.3;
		cam.attachControl(this.canvas.nativeElement, true);

		const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
		const sphere = MeshBuilder.CreateSphere('sphere', {diameter: 1}, scene);
		sphere.position.y = 0.5;

		const path = new Path2(2, 0);
		path.addLineTo(5, 2);
		path.addLineTo(1, 2);
		path.addLineTo(-5, 5);
		path.addLineTo(-3, 1);
		path.addLineTo(-4, -4);
		path.addLineTo(-2, -3);
		path.addLineTo(2, -3);

		const customPlane = new PolygonMeshBuilder('plane', path, scene, earcut);
		customPlane.build(false, 0.5);

		engine.runRenderLoop(() => scene.render());
	}

}
