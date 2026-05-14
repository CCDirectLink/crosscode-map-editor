import { Globals } from '../globals';
import { Scene } from 'phaser';
import { debounceTime, Subscription } from 'rxjs';
import { Helper } from './helper';

export interface WeatherTypes {
	NONE: WeatherType;
	
	[key: string]: Partial<WeatherType> | undefined;
}

export interface WeatherType {
	lightMapDarkness: number;
	glowColor: string;
}

const LIGHTMAP_KEY = 'media/map/lightmap.png';

// from CrossCode source
const LIGHT_METRIC = [
	null,
	{ x: 0, y: 0, w: 384, h: 384 }, // 1 XXXXL
	{ x: 384, y: 0, w: 256, h: 256 }, // 2 XXXL
	{ x: 448, y: 256, w: 192, h: 192 }, // 3 XXL
	{ x: 0, y: 384, w: 128, h: 128 }, // 4 XL
	{ x: 128, y: 448, w: 64, h: 64 }, // 5 L
	{ x: 192, y: 464, w: 48, h: 48 }, // 6 M
	{ x: 240, y: 480, w: 32, h: 32 }, // 7 S
	{ x: 272, y: 480, w: 32, h: 32 }, // 8 XS
] as const;

const OFFSETS: [number, number][] = [
	[0, 0], [0, -8], [8, 0], [0, 8], [-8, 0], [8, -8],
];

export class Lightmap extends Phaser.GameObjects.GameObject {
	
	private subs: Subscription[] = [];
	private renderTexture?: Phaser.GameObjects.RenderTexture;
	private eraser?: Phaser.GameObjects.Image;
	private ready: Promise<void>;
	
	
	constructor(scene: Scene) {
		super(scene, 'Lightmap');
		this.ready = this.preload();
		this.subs.push(Globals.mapLoaderService.tileMap.subscribe((map) => {
			if (map) {
				this.updateSize();
			}
		}));
		this.subs.push(Globals.globalEventsService.resizeMap.subscribe(() => this.updateSize()));
		this.subs.push(Globals.globalEventsService.renderLights.subscribe(() => this.renderLights()));
	}
	
	private async preload() {
		await Helper.loadTexture(LIGHTMAP_KEY, this.scene);
		
		const tex = this.scene.textures.get(LIGHTMAP_KEY);
		for (let i = 1; i < LIGHT_METRIC.length; i++) {
			const m = LIGHT_METRIC[i]!;
			const frameKey = `light_${i}`;
			if (!tex.has(frameKey)) {
				tex.add(frameKey, 0, m.x, m.y, m.w, m.h);
			}
		}
		
		this.eraser = this.scene.make.image({ key: LIGHTMAP_KEY, add: false }).setOrigin(0.5, 0.5);
	}
	
	private async renderLights() {
		
		if (!this.renderTexture) {
			console.error('no rnder texture');
			return;
		}
		
		this.renderTexture.visible = false;
		
		if (!Globals.globalEventsService.renderLights.getValue()) {
			console.error('no lights render');
			return;
		}
		
		const map = Globals.map;
		const lightLayer = map.layers.find(l => l.details.type === 'Light');
		
		if (!lightLayer) {
			console.error('no light layer');
			return;
		}
		
		this.renderTexture.visible = true;
		
		await this.ready;
		
		this.renderTexture.fill(0x000000, 1);
		
		const weatherTypes = await Globals.jsonLoader.loadJsonMerged<WeatherTypes>('weather-types.json');
		const weatherType = {
			...weatherTypes.NONE,
			...weatherTypes[map.attributes.weather],
		};
		this.renderTexture.alpha = 1 - weatherType.lightMapDarkness;
		
		this.drawLights(lightLayer.getPhaserLayer());
	}
	
	private drawLights(layer: Phaser.Tilemaps.TilemapLayer) {
		const rt = this.renderTexture!;
		const tileSize = Globals.TILE_SIZE;
		const eraser = this.eraser!;
		
		const data = layer.layer.data;
		for (let row = 0; row < data.length; row++) {
			for (let col = 0; col < data[row].length; col++) {
				const tile = data[row][col].index;
				if (tile <= 0) {
					continue;
				}
				
				const n = tile - 1;
				const lightSize = (n % 32) % 5 + 1;
				const glowType = Math.floor((n % 32) / 5);
				const offsetType = Math.floor(n / 32);
				
				if (glowType === 4) {
					continue; // glow only, no light
				}
				
				const [offX, offY] = OFFSETS[offsetType] ?? [0, 0];
				const cx = col * tileSize + tileSize / 2 + offX;
				const cy = row * tileSize + tileSize / 2 + offY;
				
				eraser.setFrame(`light_${lightSize}`);
				rt.erase(eraser, cx, cy);
			}
		}
	}
	
	private async updateSize() {
		const width = Globals.map.mapWidth * Globals.TILE_SIZE;
		const height = Globals.map.mapHeight * Globals.TILE_SIZE;
		this.renderTexture?.destroy();
		this.renderTexture = this.scene.add.renderTexture(0, 0, width, height);
		this.renderTexture.setOrigin(0, 0);
		this.renderTexture.depth = 999999;
		await this.renderLights();
	}
	
	override destroy(fromScene?: boolean) {
		super.destroy(fromScene);
		this.renderTexture?.destroy();
		this.eraser?.destroy();
		this.subs.forEach(s => s.unsubscribe());
	}
	
}
