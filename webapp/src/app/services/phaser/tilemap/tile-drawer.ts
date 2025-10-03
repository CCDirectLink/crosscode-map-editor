import * as Phaser from 'phaser';
import { Point } from '../../../models/cross-code-map';
import { SelectedTile } from '../../../models/tile-selector';
import { Globals } from '../../globals';
import { BaseObject } from '../base-object';
import { Helper } from '../helper';
import { Vec2 } from '../vec2';
import { CCMapLayer } from './cc-map-layer';
import { Filler } from './fill';
import { pointsInLine } from './points-in-line';
import { customPutTileAt } from './layer-helper';
import { BaseTileDrawer } from '../BaseTileDrawer';

export class TileDrawer extends BaseObject {
	private selectedTiles: SelectedTile[] = [];
	private layer?: CCMapLayer;

	private baseDrawer!: BaseTileDrawer;

	private renderLayersTransparent = false;

	private container!: Phaser.GameObjects.Container;

	private transparentKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	private shiftKey!: Phaser.Input.Keyboard.Key;
	private fillKey!: Phaser.Input.Keyboard.Key;
	private lastDraw: Point = { x: -1, y: -1 };

	private dirty = false;

	constructor(scene: Phaser.Scene) {
		super(scene, 'tileDrawer');
	}

	protected override init() {
		this.fillKey = this.scene.input.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.F,
			false,
		);
		this.transparentKey = this.scene.input.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.R,
			false,
		);
		this.visibilityKey = this.scene.input.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.V,
			false,
		);
		this.shiftKey = this.scene.input.keyboard!.addKey(
			Phaser.Input.Keyboard.KeyCodes.SHIFT,
			false,
		);

		this.container = this.scene.add.container(0, 0);
		this.container.depth = 10000;

		this.baseDrawer = new BaseTileDrawer(this.scene, false, this.container);
		this.baseDrawer.resetSelectedTiles();
		this.scene.add.existing(this.baseDrawer);
	}

	private async selectLayer(selectedLayer?: CCMapLayer) {
		this.layer = selectedLayer;
		await this.baseDrawer.setLayer(selectedLayer);

		this.setLayerAlpha();

		if (!selectedLayer || !selectedLayer.details.tilesetName) {
			this.container.visible = false;
			return;
		}
		this.container.visible = true;
	}

	preUpdate(): void {
		// hide cursor when no map loaded
		if (!this.layer) {
			this.container.visible = false;
			return;
		}
		const pointer = this.scene.input.activePointer;
		const p = Helper.worldToTile(
			pointer.worldX - this.layer.x,
			pointer.worldY - this.layer.y,
		);

		// draw tiles
		// trigger only when mouse is over canvas element (the renderer), avoids triggering when interacting with ui
		if (
			pointer.leftButtonDown() &&
			pointer.downElement?.nodeName === 'CANVAS' &&
			this.layer
		) {
			const finalPos = { x: 0, y: 0 };
			const startPos = { x: 0, y: 0 };

			// skip drawing if last frame was the same
			if (this.lastDraw.x === p.x && this.lastDraw.y === p.y) {
				return;
			}

			// skip drawing if panning key is down
			if (Globals.panning) {
				return;
			}

			this.dirty = true;
			for (const tile of this.selectedTiles) {
				finalPos.x = p.x + tile.offset.x;
				finalPos.y = p.y + tile.offset.y;

				startPos.x = this.lastDraw.x + tile.offset.x;
				startPos.y = this.lastDraw.y + tile.offset.y;

				const points =
					this.lastDraw.x < 0
						? [finalPos]
						: pointsInLine(startPos, finalPos);
				for (const point of points) {
					if (Helper.isInBounds(this.layer, point)) {
						const phaserLayer = this.layer.getPhaserLayer();
						if (!phaserLayer) {
							return;
						}

						customPutTileAt(
							tile.id,
							point.x,
							point.y,
							phaserLayer.layer,
						);

						if (!this.shiftKey.isDown) {
							Globals.autotileService.drawTile(
								this.layer,
								point.x,
								point.y,
								tile.id,
							);
						}
					}
				}
			}
			Vec2.assign(this.lastDraw, p);
		}
	}

	protected deactivate() {
		this.container.visible = false;
		this.baseDrawer.setActive(false);
	}

	protected activate() {
		this.addSubscription(
			Globals.mapLoaderService.selectedLayer.subscribe((layer) =>
				this.selectLayer(layer),
			),
		);
		this.addSubscription(
			Globals.phaserEventsService.changeSelectedTiles.subscribe(
				(tiles) => (this.selectedTiles = tiles),
			),
		);
		this.baseDrawer.setActive(true);

		const fill = () => {
			if (!Helper.isInputFocused()) {
				this.fill();
			}
		};
		this.addKeybinding({ event: 'up', fun: fill, emitter: this.fillKey });

		const leftUp = (pointer: Phaser.Input.Pointer) => {
			if (!pointer.leftButtonReleased()) {
				return;
			}

			if (!this.layer) {
				return;
			}

			this.lastDraw.x = -1;

			if (!this.dirty) {
				return;
			}
			this.dirty = false;

			Globals.stateHistoryService.saveState({
				name: 'Tile Drawer',
				icon: 'create',
			});
		};
		this.addKeybinding({
			event: 'pointerup',
			fun: leftUp,
			emitter: this.scene.input,
		});
		this.addKeybinding({
			event: 'pointerupoutside',
			fun: leftUp,
			emitter: this.scene.input,
		});

		const transparent = () => {
			if (!Helper.isInputFocused()) {
				this.renderLayersTransparent = !this.renderLayersTransparent;
				this.setLayerAlpha();
			}
		};
		this.addKeybinding({
			event: 'up',
			fun: transparent,
			emitter: this.transparentKey,
		});

		const visible = () => {
			if (!Helper.isInputFocused()) {
				Globals.globalEventsService.toggleVisibility.next();
			}
		};
		this.addKeybinding({
			event: 'up',
			fun: visible,
			emitter: this.visibilityKey,
		});
	}

	private setLayerAlpha() {
		const map = Globals.map;
		if (map) {
			map.layers.forEach((layer) => {
				layer.alpha = this.renderLayersTransparent ? 0.5 : 1;
			});
			if (this.layer) {
				this.layer.alpha = 1;
			}
		}
	}

	private fill() {
		if (!this.layer) {
			return;
		}

		const pointer = this.scene.input.activePointer;
		const p = Helper.worldToTile(
			pointer.worldX - this.layer.x,
			pointer.worldY - this.layer.y,
		);

		if (this.selectedTiles.length > 0) {
			Filler.fill(this.layer, this.selectedTiles[0].id, p);
			Globals.stateHistoryService.saveState({
				name: 'fill',
				icon: 'format_color_fill',
			});
		}
	}
}
