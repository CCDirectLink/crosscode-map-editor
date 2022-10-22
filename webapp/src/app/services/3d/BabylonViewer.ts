import { Color3, Engine, FreeCamera, HemisphericLight, Mesh, Scene, Vector3 } from '@babylonjs/core';
import { EditorView } from '../../models/editor-view';
import { Globals } from '../../services/globals';
import { GlobalEventsService } from '../global-events.service';
import { CCMapLayer } from '../phaser/tilemap/cc-map-layer';
import { CustomFreeCamera } from './camera/custom-free-camera';
import { showAxis } from './debug/show-axis';
import { ToggleMesh } from './debug/toggle-mesh';
import { EntityGenerator } from './entities/entity-generator';
import { EntityManager3d } from './entities/entity-manager-3d';
import { LayerMeshGenerator } from './layer-generation/layer-mesh-generator';
import { TextureGenerator } from './layer-generation/texture-generator';
import { addWireframeButton } from './ui/wireframe';

interface CamStore {
	position: Vector3;
	rotation: Vector3;
}

export class BabylonViewer {
	private engine?: Engine;
	private scene?: Scene;
	private cam?: FreeCamera;
	private readonly storageKey = 'camPos';
	private textureGenerator = new TextureGenerator();
	private groundLayers: CCMapLayer[] = [];
	private entityManager?: EntityManager3d;
	
	public constructor(
		private globalEvents: GlobalEventsService
	) {
	}
	
	public async init(canvas: HTMLCanvasElement) {
		try {
			this.globalEvents.babylonLoading.next(true);
			this.textureGenerator.init();
			await this.initBabylonInternal(canvas);
		} finally {
			this.globalEvents.babylonLoading.next(false);
		}
	}
	
	private async initBabylonInternal(canvas: HTMLCanvasElement) {
		const map = Globals.map;
		this.groundLayers = [];
		const engine = new Engine(canvas);
		this.engine = engine;
		const scene = new Scene(engine);
		this.scene = scene;
		
		const cam = new CustomFreeCamera('camera', new Vector3(0, 0, -4), scene);
		cam.position.y = 1;
		cam.speed = 0.3;
		cam.attachControl(canvas, true);
		cam.minZ = 0;
		this.cam = cam;
		
		Object.assign(cam.rotation, {
			x: 0.7,
			y: 0,
			z: 0
		});
		
		Object.assign(cam.position, {
			x: map.mapWidth / 2,
			y: 31,
			z: (-map.mapHeight / 2) - 36
		});
		
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
		
		performance.mark('start');
		
		let layers = map.layers.filter(layer => layer.details.type.toLowerCase() === 'collision');
		layers.sort((a, b) => a.details.level - b.details.level);
		
		// add another layer to the bottom to make the ground visible
		layers = [await this.generateGroundLayer(layers[0]), ...layers];
		// layers = [layers[2]];
		
		const meshGenerator = new LayerMeshGenerator();
		
		const allMeshes: Mesh[] = [];
		
		for (let i = 0; i < layers.length; i++) {
			performance.mark('layerStart');
			const coll = layers[i];
			const above = layers[i + 1];
			let renderAll = 0;
			if (i === layers.length - 2) {
				renderAll = 9999;
			}
			const layerMaterial = this.textureGenerator.generate(coll.details.level + 1 + renderAll, scene);
			performance.mark('texture');
			const meshes = meshGenerator.generateLevel(coll, above, scene);
			
			for (const mesh of meshes) {
				mesh.material = layerMaterial;
			}
			
			allMeshes.push(...meshes);
			performance.mark('layerEnd');
			performance.measure('layer: ' + coll.details.level, 'layerStart', 'layerEnd');
			performance.measure('texture: ' + coll.details.level, 'layerStart', 'texture');
			performance.measure('mesh: ' + coll.details.level, 'texture', 'layerEnd');
			
			
		}
		performance.mark('layersEnd');
		
		
		const entityManager = new EntityManager3d();
		this.entityManager = entityManager;
		
		const entityGenerator = new EntityGenerator(entityManager);
		
		const entities = map.entityManager.entities;
		const promises: Promise<any>[] = [];
		for (const e of entities) {
			promises.push(entityGenerator.generateEntity(e, scene));
		}
		
		await Promise.all(promises);
		performance.mark('end');
		
		entityManager.init(entityGenerator, scene);
		
		const toggle = new ToggleMesh(scene);
		
		addWireframeButton(toggle, allMeshes);
		
		showAxis(2, scene);
		
		performance.measure('layers', 'start', 'layersEnd');
		performance.measure('entities', 'layersEnd', 'end');
		
		this.globalEvents.currentView.next(EditorView.Entities);
		
		engine.runRenderLoop(() => scene.render());
	}
	
	
	private async generateGroundLayer(other: CCMapLayer) {
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
		
		layer.getPhaserLayer()!.putTilesAt(layer.details.data, 0, 0, false);
		this.groundLayers.push(layer);
		return layer;
	}
	
	onDestroy() {
		for (const layer of this.groundLayers) {
			layer.destroy();
		}
		
		if (this.entityManager) {
			this.entityManager.destroy();
		}
		
		this.textureGenerator.destroy();
		if (this.cam) {
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
		this.globalEvents.babylonLoading.next(false);
	}
	
}
