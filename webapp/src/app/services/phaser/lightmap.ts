import { Globals } from '../globals';
import { Scene } from 'phaser';
import { Subscription } from 'rxjs';
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

const FRAME_KEY = 'light_';
const TEXTURE_Z = 999999;

export class Lightmap extends Phaser.GameObjects.GameObject {
	
	private subs: Subscription[] = [];
	private renderTexture?: Phaser.GameObjects.RenderTexture;
	private glowRenderTexture?: Phaser.GameObjects.RenderTexture;
	private readonly imagePool: Phaser.GameObjects.Image[] = [];
	private readonly ready: Promise<void>;
	
	
	constructor(scene: Scene) {
		super(scene, 'Lightmap');
		this.ready = this.init();
		this.subs.push(Globals.mapLoaderService.tileMap.subscribe((map) => {
			if (map) {
				void this.updateSize();
			}
		}));
		this.subs.push(Globals.globalEventsService.resizeMap.subscribe(() => this.updateSize()));
		this.subs.push(Globals.globalEventsService.renderLights.subscribe(() => this.renderLights()));
		this.subs.push(Globals.globalEventsService.lightsChanged.subscribe(() => this.renderLights()));
	}
	
	private async init() {
		await Helper.loadTexture(LIGHTMAP_KEY, this.scene);
		
		const tex = this.scene.textures.get(LIGHTMAP_KEY);
		for (let i = 1; i < LIGHT_METRIC.length; i++) {
			const m = LIGHT_METRIC[i]!;
			const frameKey = `${FRAME_KEY}${i}`;
			if (!tex.has(frameKey)) {
				tex.add(frameKey, 0, m.x, m.y, m.w, m.h);
			}
		}
	}
	
	private poolImage(index: number): Phaser.GameObjects.Image {
		let img = this.imagePool[index];
		if (!img) {
			img = this.scene.make.image({ key: LIGHTMAP_KEY, add: false })
				.setOrigin(0.5, 0.5)
				.setBlendMode(Phaser.BlendModes.ADD);
			this.imagePool[index] = img;
		}
		return img;
	}
	
	private async renderLights() {
		
		if (!this.renderTexture || !this.glowRenderTexture) {
			return;
		}
		
		this.renderTexture.visible = false;
		this.glowRenderTexture.visible = false;
		
		if (!Globals.globalEventsService.renderLights.getValue()) {
			return;
		}
		
		const map = Globals.map;
		const lightLayer = map.layers.find(l => l.details.type === 'Light');
		
		if (!lightLayer) {
			return;
		}
		
		await this.ready;
		
		this.renderTexture.visible = true;
		this.glowRenderTexture.visible = true;
		
		this.renderTexture.fill(0x000000, 1);
		this.glowRenderTexture.fill(0x000000, 1);
		
		const weatherTypes = await Globals.jsonLoader.loadJsonMerged<WeatherTypes>('weather-types.json');
		const weatherType = {
			...weatherTypes.NONE,
			...weatherTypes[map.attributes.weather],
		};
		this.renderTexture.alpha = weatherType.lightMapDarkness;
		
		const glowColor = Phaser.Display.Color.HexStringToColor(weatherType.glowColor).color;
		const tileSize = Globals.TILE_SIZE;
		const data = lightLayer.getPhaserLayer().layer.data;
		
		const eraseEntries: Phaser.GameObjects.Image[] = [];
		const glowEntries: Phaser.GameObjects.Image[] = [];
		let poolIndex = 0;
		
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
				
				const [offX, offY] = OFFSETS[offsetType] ?? [0, 0];
				const cx = col * tileSize + tileSize / 2 + offX;
				const cy = row * tileSize + tileSize / 2 + offY;
				
				if (glowType !== 4) {
					const img = this.poolImage(poolIndex++);
					img.setFrame(`${FRAME_KEY}${lightSize}`).setPosition(cx, cy);
					eraseEntries.push(img);
				}
				
				if (glowType > 0) {
					const glowSize = glowType === 4 ? lightSize : lightSize + glowType - 1;
					if (glowSize >= 1 && glowSize < LIGHT_METRIC.length) {
						const img = this.poolImage(poolIndex++);
						img.setFrame(`${FRAME_KEY}${glowSize}`).setPosition(cx, cy).setTint(glowColor);
						glowEntries.push(img);
					}
				}
			}
		}
		
		this.renderTexture!.erase(eraseEntries);
		
		// glow can't be batched because of blend mode ADD
		for (const img of glowEntries) {
			this.glowRenderTexture!.draw(img);
		}
	}
	
	private createRenderTexture(width: number, height: number, depth: number, blendMode?: Phaser.BlendModes) {
		const texture = this.scene.add.renderTexture(0, 0, width, height);
		texture.setOrigin(0, 0);
		texture.depth = depth;
		if (blendMode !== undefined) {
			texture.setBlendMode(blendMode);
		}
		return texture;
	}
	
	private async updateSize() {
		const width = Globals.map.mapWidth * Globals.TILE_SIZE;
		const height = Globals.map.mapHeight * Globals.TILE_SIZE;
		
		if (this.renderTexture) {
			this.renderTexture.resize(width, height);
		} else {
			this.renderTexture = this.createRenderTexture(width, height, TEXTURE_Z);
		}
		
		if (this.glowRenderTexture) {
			this.glowRenderTexture.resize(width, height);
		} else {
			this.glowRenderTexture = this.createRenderTexture(width, height, TEXTURE_Z - 1, Phaser.BlendModes.ADD);
		}
		
		await this.renderLights();
	}
	
	override destroy(fromScene?: boolean) {
		super.destroy(fromScene);
		this.renderTexture?.destroy();
		this.glowRenderTexture?.destroy();
		this.imagePool.forEach(img => img.destroy());
		this.subs.forEach(s => s.unsubscribe());
	}
	
}
