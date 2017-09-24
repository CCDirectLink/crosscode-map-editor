import {Sortable, SortableGroup} from '../../interfaces/sortable';
import {CCMap} from '../tilemap/cc-map';
import {Prop, PropSheet, ScalableProp, ScalablePropSheet} from '../../interfaces/props';
import {MapEntity, Point, Point3} from '../../interfaces/cross-code-map';
import {Helper} from '../helper';
import * as Phaser from 'phaser-ce';
import {EntityDefinition} from '../../interfaces/entity-definition';

export interface InputEvents {
	onInputDown?: (entity: CCEntity, pointer: Phaser.Pointer) => void;
	onInputUp?: (entity: CCEntity, pointer: Phaser.Pointer, isOver: boolean) => void;
	onDragStart?: (entity: CCEntity, pointer: Phaser.Pointer, x: number, y: number) => void;
	onDragUpdate?: (entity: CCEntity, pointer: Phaser.Pointer, x: number, y: number, point: Point, fromStart: boolean) => void;
	onDragStop?: (entity: CCEntity, pointer: Phaser.Pointer) => void;
}

export class CCEntity extends Phaser.Image implements Sortable {

	private map: CCMap;
	public group: SortableGroup;
	private levelOffsetGroup: SortableGroup;
	private boundingBoxOffsetGroup: SortableGroup;

	public definition: EntityDefinition;

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
			gfx: string | Phaser.BitmapData;
			x: number;
			y: number;
			w: number;
			h: number;
			singleColor?: boolean;
			flipX: boolean;
		}
		scalableX: boolean;
		scalableY: boolean;
		scalableStep: number;
		pivot: Point;
	} = <any>{};

	constructor(game: Phaser.Game, map: CCMap, x: number, y: number, definition: EntityDefinition, inputEvents: InputEvents) {
		super(game, 0, 0, null);
		this.setInputEvents(inputEvents);
		this.map = map;
		this.definition = definition;
		game.add.existing(this);
		this.details = <any>{};
		this.details.type = definition.type;

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

		// setup sprite
		if (s.sheet) {
			const o = s.sheet;
			this.loadTexture(o.gfx);
			if (!this.cropRect) {
				this.crop(new Phaser.Rectangle(o.x, o.y, o.w, o.h));
			} else {
				this.cropRect.setTo(o.x, o.y, o.w, o.h);
				this.updateCrop();
			}

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
		}

		this.drawBoundingBox();
		const collImg = this.collisionImage;

		// handle hover input
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

	updateType() {
		const type = this.details.type;
		const settings = this.details.settings;
		// load correct image if prop
		if (type === 'Prop') {
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
				console.error('prop not found: ' + settings.propType.name);
				return this.generateUndefinedType();
			}
			this.anchor.y = 1;
			this.anchor.x = 0.5;

			this.entitySettings = <any>{};
			this.entitySettings.sheet = prop.fix;
			this.entitySettings.baseSize = prop.size;
			this.entitySettings.collType = prop.collType;
		} else if (type === 'ScalableProp') {
			const sheet: ScalablePropSheet = this.game.cache.getJSON('scale-props/' + settings.propConfig.sheet);
			const prop: ScalableProp = sheet.entries[settings.propConfig.name];
			if (!prop) {
				console.error('scale-prop not found: ' + settings.propConfig.name);
				return this.generateUndefinedType();
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
		} else {
			return this.generateUndefinedType();
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

		this.updateLevel();
	}

	updateLevel() {
		this.updateZIndex();
		const height = this.map.levels[this.details.level.level].height;
		const offset = this.details.level.offset;
		this.levelOffsetGroup.y = -(height + offset);
	}

	// TODO: refactor
	set settings(settings: any) {
		this.details.settings = settings;
		this.updateType();
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

	private generateUndefinedType() {
		const settings = this.details.settings;
		this.entitySettings = <any>{};
		this.entitySettings.baseSize = {x: 16, y: 16, z: settings.zHeight || 0};
		if (settings.size) {
			this.entitySettings.scalableX = true;
			this.entitySettings.scalableY = true;
		} else {
			this.anchor.y = 1;
			this.anchor.x = 0.5;
		}
		const singleColor = this.game.make.bitmapData(16, 16);
		singleColor.fill(40, 60, 255, 0.5);
		this.entitySettings.sheet = {
			gfx: singleColor,
			x: 0,
			y: 0,
			w: 16,
			h: 16,
			singleColor: true,
			flipX: false,
		};
		this.updateSettings();
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
		const size = Object.assign({}, this.details.settings.size || s.baseSize);
		size.z = size.z || this.details.settings.zHeight || s.baseSize.z || 0;
		const inputArea = new Phaser.Rectangle(0, 0, size.x, size.y);

		this.collisionBitmap = this.game.make.bitmapData(inputArea.width, inputArea.height + size.z);
		const context = this.collisionBitmap.context;
		const outline = 'rgba(0,0,0,1)';

		const bottomRect = new Phaser.Rectangle(0, size.z, inputArea.width, inputArea.height - 1);

		// show middle and top part only if entity is not flat
		if (size.z > 0) {
			const middleRect = new Phaser.Rectangle(0, inputArea.height, inputArea.width, size.z - 1);
			Helper.drawRect(context, middleRect, 'rgba(255, 40, 40, 0.5)', outline);

			const topRect = new Phaser.Rectangle(0, 0, inputArea.width, inputArea.height);
			Helper.drawRect(context, topRect, 'rgba(255, 255, 40, 1)', outline);

			Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 0.1)', outline);
		} else {
			Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 1)', outline);
		}

		let collImg = this.collisionImage;
		// TODO: refactor. Image can be generated in the constructor
		if (!collImg) {
			this.collisionImage = this.game.add.image();
			collImg = this.collisionImage;
			collImg.alpha = 0;
			this.levelOffsetGroup.add(collImg);
			collImg.inputEnabled = false;
		}
		collImg.x = inputArea.x;
		collImg.y = inputArea.y - (size.z || 0);
		collImg.loadTexture(this.collisionBitmap);
	}

	exportEntity(): MapEntity {

		return {
			type: this.details.type,
			x: this.group.x,
			y: this.group.y,
			level: this.details.level.offset ? this.details.level : this.details.level.level,
			settings: this.details.settings
		};
	}
}
