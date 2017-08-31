import {Sortable, SortableGroup} from '../../interfaces/sortable';
import * as Phaser from 'phaser-ce';
import {CCMap} from '../tilemap/cc-map';
import {Prop, PropSheet, ScalableProp, ScalablePropSheet} from '../../interfaces/props';
import {Globals} from '../../globals';
import {Point, Point3} from '../../interfaces/cross-code-map';

export class CCEntity extends Phaser.Image implements Sortable {

	private boundingBox: Point3;
	private map: CCMap;
	private group: SortableGroup;
	private levelOffsetGroup: SortableGroup;
	private boundingBoxOffsetGroup: SortableGroup;

	// for resizeable entities
	private tileSprite: Phaser.TileSprite;
	private bitmap: Phaser.BitmapData;

	zIndex: number;
	details: { level: { level: number, offset: number }, type: string, settings: any };
	entitySettings: {
		collType: string;
		size: Point3;
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

	constructor(game: Phaser.Game, map: CCMap, x: number, y: number) {
		super(game, 0, 0, 'media/entity/objects/block.png');
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
		if (s.size) {
			this.boundingBoxOffsetGroup.x = s.size.x / 2;
			this.boundingBoxOffsetGroup.y = s.size.y;
		}

		// setup prop sprite
		if (s.sheet) {
			const o = s.sheet;
			this.loadTexture(o.gfx);
			this.cropRect.setTo(o.x, o.y, o.w, o.h);
			this.updateCrop();

			// setup scalable
			if (s.scalableX || s.scalableY) {
				this.bitmap = game.make.bitmapData(o.w, o.h);
				this.bitmap.draw(this, 0, 0, o.w, o.h);
				if (this.tileSprite) {
					this.boundingBoxOffsetGroup.remove(this.tileSprite);
				}
				this.tileSprite = game.make.tileSprite(0, 0, settings.size.x, settings.size.y + s.size.z, this.bitmap, undefined);
				this.boundingBoxOffsetGroup.add(this.tileSprite);
				this.boundingBoxOffsetGroup.x = 0;
				this.boundingBoxOffsetGroup.y = -s.size.z;
				this.visible = false;
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
			this.entitySettings.size = prop.size;
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
			this.entitySettings.size = prop.baseSize;
			this.entitySettings.collType = prop.collType;
			this.entitySettings.pivot = prop.pivot;
		}
		this.updateSettings();
	}

	set level(level: any) {
		const details = this.details;

		let zIndex = 0;
		if (typeof level === 'object') {
			zIndex = level.level;
			details.level = level;
		} else {
			zIndex = level;
			details.level = {
				level: level,
				offset: 0
			};
		}

		zIndex *= 10;
		zIndex++;

		// sort entities by y when on same level
		zIndex += this.group.y * 0.000001;

		this.group.zIndex = zIndex;

		this.levelOffsetGroup.y = -(this.map.levels[details.level.level].height + details.level.offset);
	}

	set settings(settings: any) {
		this.details.settings = settings;
		this.ccType = this.details.type;
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
		super.destroy();
	}

}
