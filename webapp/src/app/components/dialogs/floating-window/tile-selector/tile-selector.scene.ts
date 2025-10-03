import * as Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { Globals } from '../../../../services/globals';
import { Helper } from '../../../../services/phaser/helper';
import { MapPan } from '../../../../services/phaser/map-pan';
import { CCMapLayer } from '../../../../services/phaser/tilemap/cc-map-layer';
import { customPutTilesAt } from '../../../../services/phaser/tilemap/layer-helper';
import { BaseTileDrawer } from '../../../../services/phaser/BaseTileDrawer';

export class TileSelectorScene extends Phaser.Scene {
	private tileMap!: Phaser.Tilemaps.Tilemap;
	private subs: Subscription[] = [];

	private baseDrawer!: BaseTileDrawer;
	private tilesetWidth = 0;

	private tilemapLayer!: CCMapLayer;

	constructor() {
		super({ key: 'main' });
	}

	async create() {
		this.baseDrawer = new BaseTileDrawer(this, true);
		this.baseDrawer.resetSelectedTiles();
		this.add.existing(this.baseDrawer);

		this.cameras.main.setBackgroundColor('#616161');

		this.game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};

		this.subs.push(
			Globals.mapLoaderService.selectedLayer.subscribe(async (layer) => {
				const success = await this.drawTileset(layer);
				if (!success) {
					this.tileMap.removeAllLayers();
					await this.baseDrawer.setLayer();
				}
			}),
		);

		this.subs.push(
			Globals.phaserEventsService.changeSelectedTiles.subscribe(
				(tiles) => {
					this.baseDrawer.drawRect(0, 0);
					if (tiles.length === 0) {
						return;
					}
					const baseTile = tiles[0];

					if (baseTile.id === 0) {
						return;
					}
					let width = 0;
					let height = 0;

					// If the selection is a continuous rectangle in the tile selector, highlight it
					for (const tile of tiles) {
						const id =
							tile.id -
							tile.offset.x -
							tile.offset.y * this.tilesetWidth;
						if (baseTile.id !== id) {
							return;
						}
						width = Math.max(width, tile.offset.x);
						height = Math.max(height, tile.offset.y);
					}

					const start = Helper.indexToPoint(
						baseTile.id,
						this.tilesetWidth,
					);
					this.baseDrawer.drawRect(
						width + 1,
						height + 1,
						start.x * Globals.TILE_SIZE,
						start.y * Globals.TILE_SIZE,
					);
				},
			),
		);

		const pan = new MapPan(this, 'mapPan');
		this.add.existing(pan);

		this.tileMap = this.add.tilemap(
			undefined,
			Globals.TILE_SIZE,
			Globals.TILE_SIZE,
		);
		this.tilemapLayer = new CCMapLayer(this.tileMap);

		await this.tilemapLayer.init({
			type: 'Background',
			name: 'fromPhaser',
			level: 0,
			width: 1,
			height: 1,
			visible: 1,
			tilesetName: '',
			repeat: false,
			distance: 0,
			tilesize: Globals.TILE_SIZE,
			moveSpeed: { x: 0, y: 0 },
			data: [],
		});
	}

	public resize() {
		const size = this.scale.gameSize;
		this.game.scale.resize(size.width, size.height);
	}

	destroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
		this.subs = [];
	}

	private async drawTileset(selectedLayer?: CCMapLayer): Promise<boolean> {
		if (!selectedLayer?.details.tilesetName) {
			return false;
		}

		const exists = await Helper.loadTexture(
			selectedLayer.details.tilesetName,
			this,
		);
		if (!exists) {
			return false;
		}

		const tilesetSize = Helper.getTilesetSize(
			this,
			selectedLayer.details.tilesetName,
		);
		this.tilesetWidth = tilesetSize.x;
		this.tileMap.removeAllLayers();
		const tileset = this.tileMap.addTilesetImage(
			selectedLayer.details.tilesetName,
		);
		if (!tileset) {
			return false;
		}
		tileset.firstgid = 1;
		const layer = this.tileMap.createBlankLayer(
			'first',
			tileset,
			0,
			0,
			tilesetSize.x,
			tilesetSize.y,
		)!;

		let counter = 1;
		const data: number[][] = [];
		for (let y = 0; y < tilesetSize.y; y++) {
			data[y] = [];
			for (let x = 0; x < tilesetSize.x; x++) {
				data[y][x] = counter;
				counter++;
			}
		}

		customPutTilesAt(data, layer);
		this.tilemapLayer.setPhaserLayer(layer);
		await this.baseDrawer.setLayer(this.tilemapLayer);

		return true;
	}
}
