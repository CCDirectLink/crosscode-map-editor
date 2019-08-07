import { CrossCodeMap, Point } from '../../../models/cross-code-map';
import { CCMapLayer } from './cc-map-layer';
import { EntityManager } from '../entities/entity-manager';
import { SettingsService } from '../../../services/settings.service';
import { EventService } from '../../../services/event.service';

export class CCMap {
	public layers: CCMapLayer[] = [];

	private tileMap?: Phaser.Tilemaps.Tilemap;

	constructor(
		public readonly data: CrossCodeMap,

		private scene: Phaser.Scene,
		private entityManager: EntityManager,
		private settings: SettingsService,
		private events: EventService,
	) {
		this.loadMap(data);
	}

	public get tilemap(): Phaser.Tilemaps.Tilemap | undefined {
		return this.tileMap;
	}

	public async loadDefinitions(): Promise<void> {
		await Promise.all(
			this.layers.map(layer => layer.loadDefinitions())
		);
	}

	public get images(): string[] {
		return (<string[]>[]).concat(
			...this.layers.map(l => l.images)
		);
	}

	public loadMap(map: CrossCodeMap): void {
		const tileMap = this.scene.make.tilemap({
			width: map.mapWidth,
			height: map.mapHeight,
			tileHeight: this.settings.TILE_SIZE,
			tileWidth: this.settings.TILE_SIZE
		});

		this.tileMap = tileMap;

		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());
		this.layers = [];

		// generate Map Layers
		if (this.data.layer) {
			this.data.layer.forEach(layer => {
				const ccLayer = new CCMapLayer(tileMap, layer);
				this.layers.push(ccLayer);
			});
		}

		// generate entities
		this.entityManager.initialize(map);

		this.events.tileMap.next(this);
		this.events.selectedLayer.next(this.layers[0]);
	}

	public resize(width: number, height: number, skipRender = false): void {
		this.data.mapWidth = width;
		this.data.mapHeight = height;

		this.layers.forEach(layer => layer.resize(width, height, skipRender));
		this.events.updateMapBorder.next(true);
	}

	public offsetMap(offset: Point, borderTiles = false): void {
		this.layers.forEach(layer => layer.offsetLayer(offset, borderTiles));
	}

	public addLayer(layer: CCMapLayer): void {
		this.data.layer.push(layer.data);
		this.layers.push(layer);
	}

	public removeLayer(layer: CCMapLayer): void {
		const index = this.layers.indexOf(layer);
		this.data.layer.splice(index, 1);
		this.layers.splice(index, 1);
		layer.destroy();
	}
}
