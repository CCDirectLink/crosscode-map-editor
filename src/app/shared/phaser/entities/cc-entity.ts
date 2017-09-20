import {Sortable, SortableGroup} from '../../interfaces/sortable';
import {CCMap} from '../tilemap/cc-map';
import {Prop, PropSheet, ScalableProp, ScalablePropSheet} from '../../interfaces/props';
import {Point, Point3} from '../../interfaces/cross-code-map';
import {Helper} from '../helper';
import * as Phaser from 'phaser-ce';
import {Vec2} from '../vec2';

export interface InputEvents {
	onInputDown?: (entity: CCEntity, pointer: Phaser.Pointer) => void;
	onInputUp?: (entity: CCEntity, pointer: Phaser.Pointer, isOver: boolean) => void;
	onDragStart?: (entity: CCEntity, pointer: Phaser.Pointer, x: number, y: number) => void;
	onDragUpdate?: (entity: CCEntity, pointer: Phaser.Pointer, x: number, y: number, point: Point, fromStart: boolean) => void;
	onDragStop?: (entity: CCEntity, pointer: Phaser.Pointer) => void;
}

export class CCEntity extends Phaser.Image implements Sortable {

	private boundingBox: Point3;
	private map: CCMap;
	public group: SortableGroup;
	private levelOffsetGroup: SortableGroup;
	private boundingBoxOffsetGroup: SortableGroup;

	// for resizeable entities
	private tileSprite: Phaser.TileSprite;
	private bitmap: Phaser.BitmapData;

	// input (is handled mostly by entity manager)
	private collisionBitmap: Phaser.BitmapData;
	public collisionImage: Phaser.Image;
	private inputEvents: InputEvents = {};
	private selected = false;

	// drag
	public isDragged = false;
	public startOffset: Point = {};

	zIndex: number;
	details: { level: { level: number, offset: number }, type: string, settings: any };
	entitySettings: {
		collType: string;
		baseSize: Point3;
		sheet: {
			gfx: string;
			x: number;
			y: number;
			w: number;
			h: number;
			flipX: boolean;
		}
		scalableX: boolean;
		scalableY: boolean;
		scalableStep: number;
		pivot: Point;
	} = <any>{};

	constructor(game: Phaser.Game, map: CCMap, x: number, y: number, inputEvents: InputEvents) {
		super(game, 0, 0, 'media/entity/objects/block.png');
		this.setInputEvents(inputEvents);
		this.map = map;
		game.add.existing(this);
		this.crop(new Phaser.Rectangle(0, 0, 32, 32));
		this.details = <any>{};

		this.boundingBoxOffsetGroup = game.add.group();
		this.boundingBoxOffsetGroup.add(this);

		this.levelOffsetGroup = game.add.group();
		this.levelOffsetGroup.add(this.boundingBoxOffsetGroup);

		this.group = game.add.group();
		this.group.add(this.levelOffsetGroup);

		// actual coordinates of the entity
		this.group.x = Math.round(x);
		this.group.y = Math.round(y);

		const testimg = game.add.image(0, 0, 'media/entity/objects/block.png', undefined, this.group);
		testimg.crop(new Phaser.Rectangle(10, 20, 5, 5));
	}

	updateSettings() {
		const s = this.entitySettings;
		const settings = this.details.settings;
		const game = this.game;

		// bound box offset
		if (s.baseSize) {
			this.boundingBoxOffsetGroup.x = s.baseSize.x / 2;
			this.boundingBoxOffsetGroup.y = s.baseSize.y;
		}

		// setup prop sprite
		if (s.sheet) {
			const o = s.sheet;
			this.loadTexture(o.gfx);
			this.cropRect.setTo(o.x, o.y, o.w, o.h);
			this.updateCrop();

			// setup scalable
			if (s.scalableX || s.scalableY) {
				if (this.bitmap) {
					this.bitmap.destroy();
				}
				this.bitmap = game.make.bitmapData(o.w, o.h);
				this.bitmap.draw(this, 0, 0, o.w, o.h);
				if (this.tileSprite) {
					this.boundingBoxOffsetGroup.remove(this.tileSprite);
				}
				this.tileSprite = game.make.tileSprite(0, 0, settings.size.x, settings.size.y + s.baseSize.z, this.bitmap, undefined);
				this.boundingBoxOffsetGroup.add(this.tileSprite);
				this.boundingBoxOffsetGroup.x = 0;
				this.boundingBoxOffsetGroup.y = -s.baseSize.z;
				this.visible = false;
			}

			// setup bounding box
			if (s.baseSize) {
				this.drawBoundingBox();
				const collImg = this.collisionImage;

				// handle input
				collImg.events.onInputOver.add(() => {
					if (!this.selected) {
						collImg.alpha = 0.35;
					}
				});
				collImg.events.onInputOut.add(() => {
					if (!this.selected) {
						collImg.alpha = 0;
					}
				});

				this.setEvents();
			}
		}
	}

	set ccType(type: string) {
		this.details.type = type;

		// load correct image if prop
		if (type === 'Prop') {
			const settings = this.details.settings;
			const sheet: PropSheet = this.game.cache.getJSON('props/' + settings.propType.sheet);
			let prop: Prop;
			for (let i = 0; i < sheet.props.length; i++) {
				const p = sheet.props[i];
				if (settings.propType.name === p.name) {
					prop = p;
					break;
				}
			}
			if (!prop) {
				throw new Error('prop not found: ' + settings.propType.name);
			}
			this.anchor.y = 1;
			this.anchor.x = 0.5;

			this.entitySettings = <any>{};
			this.entitySettings.sheet = prop.fix;
			this.entitySettings.baseSize = prop.size;
			this.entitySettings.collType = prop.collType;
		} else if (type === 'ScalableProp') {
			const settings = this.details.settings;
			const sheet: ScalablePropSheet = this.game.cache.getJSON('scale-props/' + settings.propConfig.sheet);
			const prop: ScalableProp = sheet.entries[settings.propConfig.name];
			if (!prop) {
				throw new Error('scale-prop not found: ' + settings.propConfig.name);
			}

			this.entitySettings = <any>{};
			if (prop.gfx) {
				this.entitySettings.sheet = {
					gfx: prop.gfx,
					x: prop.gfxBaseX + prop.patterns.x,
					y: prop.gfxBaseY + prop.patterns.y,
					w: prop.patterns.w,
					h: prop.patterns.h,
					flipX: false,
				};
			}
			this.entitySettings.scalableX = prop.scalableX;
			this.entitySettings.scalableY = prop.scalableY;
			this.entitySettings.scalableStep = prop.scalableStep;
			this.entitySettings.baseSize = prop.baseSize;
			this.entitySettings.collType = prop.collType;
			this.entitySettings.pivot = prop.pivot;
		}
		this.updateSettings();
	}

	set level(level: any) {
		const details = this.details;

		if (typeof level === 'object') {
			details.level = level;
		} else {
			details.level = {
				level: level,
				offset: 0
			};
		}

		this.updateZIndex();

		this.levelOffsetGroup.y = -(this.map.levels[details.level.level].height + details.level.offset);
	}

	set settings(settings: any) {
		this.details.settings = settings;
		this.ccType = this.details.type;
	}

	setEnableInput(enable: boolean) {
		if (!this.collisionImage) {
			return;
		}
		this.collisionImage.inputEnabled = enable;
		this.collisionImage.alpha = 0;
		this.collisionImage.visible = enable;
	}

	setSelected(selected: boolean) {
		this.selected = selected;
		if (this.collisionImage) {
			this.collisionImage.alpha = selected ? 0.6 : 0;
		}
	}

	destroy() {
		this.group.destroy();
		this.levelOffsetGroup.destroy();
		this.boundingBoxOffsetGroup.destroy();
		if (this.tileSprite) {
			this.tileSprite.destroy();
		}
		if (this.bitmap) {
			this.bitmap.destroy();
		}
		if (this.collisionBitmap) {
			this.collisionBitmap.destroy();
		}
		super.destroy();
	}

	update() {
		super.update();
		if (this.isDragged) {
			const p = Helper.screenToWorld(this.game, this.game.input.mousePointer);
			this.group.x = Math.round(p.x - this.startOffset.x);
			this.group.y = Math.round(p.y - this.startOffset.y);
			this.updateZIndex();
		}
	}

	updateZIndex() {
		let zIndex = this.details.level.level * 10 + 1;

		// sort entities by y when on same level
		zIndex += this.group.y * 0.000001;

		this.group.zIndex = zIndex;
	}

	private setInputEvents(inputEvents: InputEvents) {
		const events = this.inputEvents;
		const input = inputEvents;
		events.onInputDown = (o, pointer) => {

			if (input.onInputDown) {
				input.onInputDown(this, pointer);
			}
		};
		events.onInputUp = (o, pointer, isOver) => {
			this.isDragged = false;
			if (input.onInputUp) {
				input.onInputUp(this, pointer, isOver);
			}
		};
	}

	private setEvents() {
		if (!this.collisionImage) {
			return;
		}
		Object.entries(this.inputEvents).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			this.collisionImage.events[key].removeAll();
			this.collisionImage.events[key].add(value);
		});
	}

	private drawBoundingBox() {
		const s = this.entitySettings;

		if (this.collisionBitmap) {
			this.collisionBitmap.destroy();
		}
		const size = this.details.settings.size || s.baseSize;
		size.z = size.z || s.baseSize.z || 0;
		const inputArea = new Phaser.Rectangle(0, 0, size.x, size.y);

		this.collisionBitmap = this.game.make.bitmapData(inputArea.width, inputArea.height + size.z);
		const context = this.collisionBitmap.context;
		const outline = 'rgba(0,0,0,1)';

		const bottomRect = new Phaser.Rectangle(0, size.z - 1, inputArea.width, inputArea.height);
		Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 1)', outline);

		// show middle and top part only if entity is not flat
		if (size.z > 0) {
			const middleRect = new Phaser.Rectangle(0, inputArea.height, inputArea.width, size.z - 1);
			Helper.drawRect(context, middleRect, 'rgba(255, 40, 40, 1)', outline);

			const topRect = new Phaser.Rectangle(0, 0, inputArea.width, inputArea.height);
			Helper.drawRect(context, topRect, 'rgba(255, 255, 40, 1)', outline);

			Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 0.1)', outline);
		}

		let enableInput = false;
		if (this.collisionImage) {
			this.levelOffsetGroup.remove(this.collisionImage);
			enableInput = this.collisionImage.inputEnabled;
		}
		this.collisionImage = this.game.add.image(inputArea.x, inputArea.y - (size.z || 0), this.collisionBitmap);
		const collImg = this.collisionImage;
		collImg.alpha = 0;

		this.levelOffsetGroup.add(collImg);

		collImg.inputEnabled = enableInput;
	}

}
