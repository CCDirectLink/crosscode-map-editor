import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Color3, Engine, FreeCamera, HemisphericLight, Scene, StandardMaterial, Texture, Vector3} from '@babylonjs/core';
import {CustomFreeCamera} from './camera/custom-free-camera';
import {TextureGenerator} from './layer-generation/texture-generator';
import {LayerMeshGenerator} from './layer-generation/layer-mesh-generator';
import {Globals} from '../../shared/globals';


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
	
	constructor() {
		this.textureGenerator = new TextureGenerator();
	}
	
	ngOnInit() {
		this.textureGenerator.init();
	}
	
	ngAfterViewInit() {
		// timeout needed because babylon would initialize with wrong width/height and would need a resize
		setTimeout(() => this.initBabylon(), 0);
	}
	
	private async initBabylon() {
		const engine = new Engine(this.canvas.nativeElement);
		this.engine = engine;
		const scene = new Scene(engine);
		this.scene = scene;
		
		console.log(this.canvas.nativeElement);
		
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
		
		const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
		light1.diffuse = new Color3(1, 1, 1).scale(1);
		light1.specular = new Color3(1, 1, 1).scale(0.2);
		
		const testMaterial = new StandardMaterial('testMat', scene);
		
		
		const map = Globals.map;
		const layers = map.layers.filter(layer => layer.details.type.toLowerCase() === 'collision');
		
		const meshGenerator = new LayerMeshGenerator();
		
		// for (const coll of layers) {
		// 	meshGenerator.generateLevel(coll);
		// }
		
		const src = await this.textureGenerator.generate(1);
		const meshes = meshGenerator.generateLevel(layers[0], scene);
		const texture = new Texture('data:level0', scene, undefined, undefined, Texture.NEAREST_SAMPLINGMODE, undefined, undefined, src);
		
		testMaterial.diffuseTexture = texture;
		
		for (const mesh of meshes) {
			mesh.material = testMaterial;
		}
		
		engine.runRenderLoop(() => scene.render());
	}
	
	ngOnDestroy() {
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
