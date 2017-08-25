import {Sortable, SortableGroup} from '../../interfaces/sortable';
import * as Phaser from 'phaser-ce';
import {CCMap} from '../tilemap/cc-map';
import {Prop, PropSheet} from '../../interfaces/props';
import {Globals} from '../../globals';
import {Point, Point3} from '../../interfaces/cross-code-map';

export class CCEntity extends Phaser.Image implements Sortable {

	private boundingBox: Point3;
	private map: CCMap;
	private group: SortableGroup;
	private levelOffsetGroup: SortableGroup;
	private boundingBoxOffsetGroup: SortableGroup;
	zIndex: number;
	details: { level: { level: number, offset: number }, type: string, settings: any };

	constructor(game: Phaser.Game, map: CCMap, x: number, y: number) {
		super(game, 0, 0, 'media/entity/objects/block.png');
		this.map = map;
		game.add.existing(this);
		this.anchor.y = 1;
		this.anchor.x = 0.5;
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

	set ccType(type: string) {
		this.details.type = type;

		// load correct image if prop
		if (type === 'Prop') {
			const settings = this.details.settings;
			const sheet: PropSheet = this.game.cache.getJSON(settings.propType.sheet);
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

			// setup prop sprite
			if (prop.fix) {
				const o = prop.fix;
				this.loadTexture(o.gfx);
				this.cropRect.setTo(o.x, o.y, o.w, o.h);
				this.updateCrop();
			}

			// bound box offset
			this.boundingBoxOffsetGroup.x = prop.size.x / 2;
			this.boundingBoxOffsetGroup.y = prop.size.y;
		}
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

}
