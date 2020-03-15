import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Color3, Engine, FreeCamera, HemisphericLight, Mesh, Scene, Vector3} from '@babylonjs/core';
import {CustomFreeCamera} from './camera/custom-free-camera';
import {TextureGenerator} from './layer-generation/texture-generator';
import {LayerMeshGenerator} from './layer-generation/layer-mesh-generator';
import {Globals} from '../../shared/globals';
import {showAxis} from './debug/show-axis';
import {ToggleMesh} from './debug/toggle-mesh';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {Router} from '@angular/router';
import {addWireframeButton} from './ui/wireframe';
import {EntityGenerator} from './entity-generation/entity-generator';
import {BabylonLoading} from './babylon-loading';


interface CamStore {
	position: Vector3;
	rotation: Vector3;
}

@Component({
	selector: 'app-babylon',
	templateUrl: './babylon.component.html',
	styleUrls: ['./babylon.component.scss']
})
export class BabylonComponent implements OnInit, AfterViewInit, OnDestroy {
	
	@ViewChild('renderCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
	
	private engine?: Engine;
	private scene?: Scene;
	private cam?: FreeCamera;
	private readonly storageKey = 'camPos';
	private textureGenerator: TextureGenerator;
	private groundLayers: CCMapLayer[] = [];
	
	loading = false;
	loadPercent = 0;
	
	constructor(
		private router: Router
	) {
		this.textureGenerator = new TextureGenerator();
	}
	
	ngOnInit() {
		// if phaser is not initialized, move away from 3d
		if (!Globals.scene.cameras) {
			this.router.navigate(['/']);
			return;
		}
		this.textureGenerator.init();
	}
	
	ngAfterViewInit() {
		if (Globals.scene.cameras) {
			// timeout needed because babylon would initialize with wrong width/height and would need a resize
			setTimeout(() => this.initBabylon(), 0);
		}
	}
	
	private async initBabylon() {
		this.loading = true;
		const map = Globals.map;
		
		const babylonLoading = new BabylonLoading();
		babylonLoading.init(map);
		this.loadPercent = 0;
		
		
		this.groundLayers = [];
		const engine = new Engine(this.canvas.nativeElement);
		this.engine = engine;
		const scene = new Scene(engine);
		this.scene = scene;
		
		const cam = new CustomFreeCamera('camera', new Vector3(0, 0, -4), scene);
		cam.position.y = 1;
		cam.speed = 0.3;
		cam.attachControl(this.canvas.nativeElement, true);
		cam.minZ = 0;
		this.cam = cam;
		
		try {
			const store = JSON.parse(sessionStorage.getItem(this.storageKey)!) as CamStore;
			Object.assign(cam.position, store.position);
			Object.assign(cam.rotation, store.rotation);
		} catch (e) {
		
		}
		
		const light1 = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
		const light2 = new HemisphericLight('light2', new Vector3(0, -1, 0), scene);
		// light1.diffuse = new Color3(1, 1, 1).scale(0.7);
		// light2.diffuse = new Color3(1, 1, 1).scale(0.7);
		
		light1.specular = new Color3(1, 1, 1).scale(0.2);
		light2.specular = new Color3(1, 1, 1).scale(0.2);
		
		
		// const light1 = new HemisphericLight('light1', new Vector3(1, 1, 1), scene);
		// light1.diffuse = new Color3(1, 1, 1).scale(1);
		// light1.specular = new Color3(1, 1, 1).scale(0);
		
		let layers = map.layers.filter(layer => layer.details.type.toLowerCase() === 'collision');
		layers.sort((a, b) => a.details.level - b.details.level);
		
		// add another layer to the bottom to make the ground visible
		layers = [await this.generateGroundLayer(layers[0]), ...layers];
		// layers = [layers[2]];
		
		
		const meshGenerator = new LayerMeshGenerator();
		
		const allMeshes: Mesh[] = [];
		
		for (let i = 0; i < layers.length; i++) {
			const coll = layers[i];
			const above = layers[i + 1];
			let renderAll = 0;
			if (i === layers.length - 2) {
				renderAll = 9999;
			}
			const layerMaterial = await this.textureGenerator.generate(coll.details.level + 1 + renderAll, scene);
			const meshes = meshGenerator.generateLevel(coll, above, scene);
			
			for (const mesh of meshes) {
				mesh.material = layerMaterial;
			}
			
			allMeshes.push(...meshes);
			this.loadPercent = babylonLoading.addLayer();
		}
		
		const entityGenerator = new EntityGenerator();
		
		const entities = map.entityManager.entities;
		const promises: Promise<any>[] = [];
		for (const e of entities) {
			promises.push(entityGenerator.generateEntity(e, scene));
		}
		
		await Promise.all(promises);
		console.log('all done');
		
		const toggle = new ToggleMesh(scene);
		
		addWireframeButton(toggle, allMeshes);
		
		showAxis(2, scene);
		
		this.loading = false;
		engine.runRenderLoop(() => scene.render());
	}
	
	private async generateGroundLayer(other: CCMapLayer) {
		// TODO: remove
		const data: number[][] = [];
		const height = other.details.height + 10;
		for (let y = 0; y < height; y++) {
			data[y] = [];
			for (let x = 0; x < other.details.width; x++) {
				data[y][x] = 2;
			}
		}
		const layer = new CCMapLayer(other.getPhaserLayer()!.tilemap);
		await layer.init({
			type: 'Collision',
			name: 'groundColl',
			level: -1,
			width: other.details.width,
			height: height,
			visible: 1,
			tilesetName: '',
			repeat: false,
			distance: 1,
			tilesize: Globals.TILE_SIZE,
			moveSpeed: {x: 0, y: 0},
			data: data,
		});
		
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < other.details.width; x++) {
				layer.getPhaserLayer()!.putTileAt(2, x, y);
			}
		}
		this.groundLayers.push(layer);
		return layer;
	}
	
	ngOnDestroy() {
		for (const layer of this.groundLayers) {
			layer.destroy();
		}
		
		
		this.textureGenerator.destroy();
		if (this.cam) {
			const camPos = this.cam.position;
			const store: CamStore = {
				rotation: this.cam.rotation,
				position: this.cam.position
			};
			sessionStorage.setItem(this.storageKey, JSON.stringify(store));
		}
		if (this.scene) {
			this.scene.dispose();
		}
		if (this.engine) {
			const gl = this.engine._gl;
			gl!.getExtension('WEBGL_lose_context')!.loseContext();
			this.engine.dispose();
		}
	}
	
}
