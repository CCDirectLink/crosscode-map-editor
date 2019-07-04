import {Sortable} from '../../../models/sortable';
import {CCMap} from '../tilemap/cc-map';
import {MapEntity, Point, Point3} from '../../../models/cross-code-map';
import {Helper} from '../helper';
import * as Phaser from 'phaser';
import {Vec2} from '../vec2';

import {Globals} from '../../globals';
import {BaseObject} from '../BaseObject';

export interface InputEvents {
	onLeftClick?: (entity: CCEntity, pointer: Phaser.Input.Pointer) => void;
	onInputDown?: (entity: CCEntity, pointer: Phaser.Input.Pointer) => void;
	onInputUp?: (entity: CCEntity, pointer: Phaser.Input.Pointer, isOver: boolean) => void;
	onDragStart?: (entity: CCEntity, pointer: Phaser.Input.Pointer, x: number, y: number) => void;
	onDragUpdate?: (entity: CCEntity, pointer: Phaser.Input.Pointer, x: number, y: number, point: Point, fromStart: boolean) => void;
	onDragStop?: (entity: CCEntity, pointer: Phaser.Input.Pointer) => void;
}

export interface ScaleSettings {
	scalableX: boolean;
	scalableY: boolean;
	baseSize: Point;
	scalableStep: number;
}

export interface EntityAttributes {
	[key: string]: AttributeValue;
}

export interface AttributeValue {
	type: string;
	description: string;
	options?: { [key: string]: any };
	
	[key: string]: any;
}

interface ImageContainer extends Phaser.GameObjects.Container {
	getAll: () => Phaser.GameObjects.Image[];
}

export abstract class CCEntity extends BaseObject {
	
	// TODO
	private map: CCMap;
	private levelOffset = 0;
	private pos: Point;
	
	private container!: ImageContainer;
	
	// public group: SortableGroup;
	// private levelOffsetGroup: SortableGroup;
	// private text: Phaser.Text;
	//
	//
	// // input (is handled mostly by entity manager)
	// private collisionBitmap: Phaser.BitmapData;
	// public collisionImage: Phaser.Image;
	// private inputEvents: InputEvents = {};
	// private selected = false;
	// private leftClickOpts: {
	// 	timer?: number;
	// 	pos?: Point;
	// } = {};
	//
	// // drag
	// public isDragged = false;
	// public startOffset: Point = {};
	//
	// zIndex: number;
	details: { level: { level: number, offset: number }, type: string, settings: any } = <any>{};
	entitySettings: {
		collType: string;
		baseSize: Point3;
		sheets: {
			fix: {
				gfx: any;
				x: number;
				y: number;
				w: number;
				h: number;
				renderHeight?: number;
				offsetX?: number;
				offsetY?: number;
				flipX?: boolean;
				flipY?: boolean;
			}[],
			offset?: Point;
			renderMode?: string;
			singleColor?: boolean;
			flipX: boolean;
		}
		scalableX: boolean;
		scalableY: boolean;
		scalableStep: number;
		pivot: Point;
	} = <any>{};
	
	protected constructor(scene: Phaser.Scene, map: CCMap, x: number, y: number, inputEvents: InputEvents, typeName: string) {
		super(scene, typeName, true);
		// this.setInputEvents(inputEvents);
		this.map = map;
		this.pos = {x: x, y: y};
		// game.add.existing(this);
		// this.details = <any>{
		// 	type: typeName
		// };
		//
		// this.boundingBoxOffsetGroup = game.add.group();
		// this.boundingBoxOffsetGroup.add(this);
		//
		// this.levelOffsetGroup = game.add.group();
		// this.levelOffsetGroup.add(this.boundingBoxOffsetGroup);
		//
		// this.group = game.add.group();
		// this.group.add(this.levelOffsetGroup);
		//
		// // actual coordinates of the entity
		// this.group.x = Math.round(x);
		// this.group.y = Math.round(y);
		//
		// const collImg = this.game.add.image();
		// this.collisionImage = collImg;
		//
		// collImg.alpha = 0;
		// this.levelOffsetGroup.add(collImg);
		// collImg.inputEnabled = false;
		//
		// // handle hover input
		// collImg.events.onInputOver.add(() => {
		// 	if (!this.selected) {
		// 		collImg.alpha = 0.35;
		// 	}
		// });
		// collImg.events.onInputOut.add(() => {
		// 	if (!this.selected) {
		// 		collImg.alpha = 0;
		// 	}
		// });
		//
		// this.visible = false;
		// this.setEvents();
	}
	
	
	protected init(): void {
		this.container = <any>this.scene.add.container(0, 0);
	}
	
	protected activate(): void {
	}
	
	
	protected deactivate(): void {
	}
	
	
	preUpdate(): void {
		// super.update();
		// this.leftClickOpts.timer += this.game.time.elapsed;
		// if (this.isDragged) {
		// 	const p = Helper.screenToWorld(this.game.input.mousePointer);
		// 	this.group.x = Math.round(p.x - this.startOffset.x);
		// 	this.group.y = Math.round(p.y - this.startOffset.y);
		//
		// 	const settings = Globals.entitySettings;
		// 	if (settings.enableGrid) {
		// 		const diffX = this.group.x % settings.gridSize;
		// 		if (diffX * 2 < settings.gridSize) {
		// 			this.group.x -= diffX;
		// 		} else {
		// 			this.group.x += settings.gridSize - diffX;
		// 		}
		//
		// 		const diffY = this.group.y % settings.gridSize;
		// 		if (diffY * 2 < settings.gridSize) {
		// 			this.group.y -= diffY;
		// 		} else {
		// 			this.group.y += settings.gridSize - diffY;
		// 		}
		// 	}
		// 	this.updateZIndex();
		// }
	}
	
	updateSettings() {
		console.log('this', this);
		const s = this.entitySettings;
		const settings = this.details.settings;
		
		this.container.removeAll(true);
		
		// bound box offset
		if (s.baseSize) {
			this.container.x = s.baseSize.x / 2;
			this.container.y = s.baseSize.y;
		}
		
		// setup sprite
		if (s.sheets && s.sheets.fix) {
			if (s.scalableX || s.scalableY) {
				// scalable
				const fix = s.sheets.fix[0];
				const width = settings.size.x;
				const height = (fix.renderHeight || s.baseSize.z) + settings.size.y;
				
				for (let x = 0; x < width; x += fix.w) {
					const imgWidth = Math.min(fix.w, width - x);
					for (let y = 0; y < height; y += fix.h) {
						const imgHeight = Math.min(fix.h, height - y);
						const img = this.scene.add.image(x, -y + settings.size.y + s.baseSize.z, fix.gfx);
						img.setCrop(fix.x, fix.y, imgWidth, imgHeight);
						
						// TODO: setOrigin, originX does not work
						img.originX = 0;
						img.originY = 1;
						this.container.add(img);
					}
				}
				
				if (s.baseSize.z) {
					this.container.x = 0;
					this.container.y = -s.baseSize.z;
				} else {
					throw new Error('basesize.z not defined');
				}
				
			} else {
				// default
				s.sheets.fix.forEach(sheet => {
					const img = this.scene.add.image(sheet.offsetX || 0, (sheet.offsetY || 0) + this.levelOffset, sheet.gfx);
					img.setOrigin(0, 0);
					
					// crop offset
					img.x -= sheet.x;
					img.y -= sheet.y;
					
					// origin offset x=0.5, y=1
					img.x -= sheet.w / 2;
					img.y -= sheet.h;
					
					
					img.setCrop(sheet.x, sheet.y, sheet.w, sheet.h);
					img.flipX = !!sheet.flipX;
					img.flipY = !!sheet.flipY;
					this.container.add(img);
				});
				
				if (s.sheets.offset) {
					this.container.getAll().forEach(img => Vec2.add(img, s.sheets.offset!));
				}
				if (s.sheets.flipX) {
					this.container.getAll().forEach(img => img.flipX = !img.flipX);
				}
			}
			
			if (s.sheets.renderMode === 'lighter') {
				this.container.getAll().forEach(img => img.blendMode = Phaser.BlendModes.ADD);
			} else if (s.sheets.renderMode === 'source-over') {
				// TODO: no idea what that actually is
				console.warn('renderMode source-over found');
			}
		}
		
		this.container.x += this.pos.x;
		this.container.y += this.pos.y;
		
		// this.drawBoundingBox();
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
		const level = this.map.levels[this.details.level.level];
		let height = 0;
		if (level) {
			height = level.height;
		}
		const offset = this.details.level.offset;
		this.levelOffset = -(height + offset);
	}
	
	// TODO: refactor
	setSettings(settings: any) {
		this.details.settings = settings;
		this.updateType();
	}
	
	setEnableInput(enable: boolean) {
		// if (!this.collisionImage) {
		// 	return;
		// }
		// this.collisionImage.inputEnabled = enable;
		// this.collisionImage.alpha = 0;
		// this.collisionImage.visible = enable;
		// if (enable) {
		// 	this.collisionImage.input.priorityID = 10;
		// }
	}
	
	setSelected(selected: boolean) {
		// this.selected = selected;
		// if (this.collisionImage) {
		// 	this.collisionImage.alpha = selected ? 0.6 : 0;
		// }
	}
	
	destroy() {
		// this.group.destroy();
		// this.levelOffsetGroup.destroy();
		// this.boundingBoxOffsetGroup.destroy();
		// if (this.collisionBitmap) {
		// 	this.collisionBitmap.destroy();
		// }
		// if (this.text) {
		// 	this.text.destroy();
		// }
		// super.destroy();
	}
	
	updateZIndex() {
		let zIndex = this.details.level.level * 10 + 1;
		
		// TODO: hack to display OLPlatform over objects because right now Object Layer is always on level 10
		if (this.details.type === 'OLPlatform') {
			zIndex += 100;
		}
		
		// sort entities by y when on same level
		zIndex += this.pos.y * 0.000001;
		
		this.container.depth = zIndex;
	}
	
	exportEntity(): MapEntity {
		// const out = {
		// 	type: this.details.type,
		// 	x: this.group.x,
		// 	y: this.group.y,
		// 	level: this.details.level.offset ? this.details.level : this.details.level.level,
		// 	settings: this.details.settings
		// };
		// return JSON.parse(JSON.stringify(out));
		return <any>null;
	}
	
	public abstract getScaleSettings(): ScaleSettings | undefined;
	
	public abstract getAttributes(): EntityAttributes;
	
	protected abstract setupType(settings: any): void;
	
	public updateType() {
		const settings = this.details.settings;
		this.setupType(settings);
	}
	
	public generateNoImageType(r?: number, g?: number, b?: number, a?: number) {
		const settings = this.details.settings;
		
		const baseSize = settings.size || {x: 16, y: 16};
		baseSize.z = settings.zHeight || settings.wallZHeight || 0;
		
		this.entitySettings = <any>{};
		this.entitySettings.baseSize = baseSize;
		const scaleSettings = this.getScaleSettings();
		if (scaleSettings && (scaleSettings.scalableX || scaleSettings.scalableY)) {
			this.entitySettings.scalableX = scaleSettings.scalableX;
			this.entitySettings.scalableY = scaleSettings.scalableY;
		} else {
			// TODO: set proper origin for no image
			// this.container.originX = 0.5;
			// this.container.originY = 1;
		}
		this.generateSingleColorSheet(0xc06040, a);
		this.updateSettings();
	}
	
	private generateSingleColorSheet(rgb: number, a?: number) {
		// TODO: should generate image key not actual gameobject
		const size = this.entitySettings.baseSize;
		const rect = this.scene.add.rectangle(0, 0, size.x, size.y, rgb, a);
		this.entitySettings.sheets = {
			fix: [{
				gfx: rect,
				x: 0,
				y: 0,
				w: size.x,
				h: size.y,
			}],
			singleColor: true,
			flipX: false,
		};
	}
	
	protected replaceJsonParams(jsonInstance: any, prop: any) {
		Object.entries(jsonInstance).forEach(([key, value]: [string, any]) => {
			if (value['jsonPARAM']) {
				jsonInstance[key] = prop[value['jsonPARAM']];
				return;
			}
			if (typeof value === 'object') {
				this.replaceJsonParams(value, prop);
			}
		});
	}
	
	// private setInputEvents(inputEvents: InputEvents) {
	// 	const events = this.inputEvents;
	// 	const input = inputEvents;
	// 	events.onInputDown = (o, pointer) => {
	// 		if (pointer.leftButton.isDown) {
	// 			this.leftClickOpts.timer = 0;
	// 			this.leftClickOpts.pos = Vec2.create(pointer);
	// 		}
	// 		if (input.onInputDown) {
	// 			input.onInputDown(this, pointer);
	// 		}
	// 	};
	// 	events.onInputUp = (o, pointer, isOver) => {
	// 		if (input.onInputUp) {
	// 			input.onInputUp(this, pointer, isOver);
	// 		}
	// 		if (isOver && this.leftClickOpts.timer < 200 && Vec2.distance2(pointer, this.leftClickOpts.pos) < 10) {
	// 			if (input.onLeftClick) {
	// 				input.onLeftClick(this, pointer);
	// 			}
	// 		}
	// 	};
	// }
	
	public getBoundingBox(): Phaser.Geom.Rectangle {
		// const img = this.collisionImage;
		// const p = Helper.phaserWorldtoWorld(img.world);
		// const rect = new Phaser.Geom.Rectangle(p.x, p.y, img.width, img.height);
		// return rect;
		return <any>null;
	}
	
	private setEvents() {
		// if (!this.collisionImage) {
		// 	return;
		// }
		// Object.entries(this.inputEvents).forEach(([key, value]) => {
		// 	if (!value) {
		// 		return;
		// 	}
		// 	if (!this.collisionImage.events[key]) {
		// 		return;
		// 	}
		// 	this.collisionImage.events[key].removeAll();
		// 	this.collisionImage.events[key].add(value);
		// });
	}
	
	// private drawBoundingBox() {
	// 	const s = this.entitySettings;
	//
	// 	if (this.collisionBitmap) {
	// 		this.collisionBitmap.destroy();
	// 	}
	// 	const size = Object.assign({}, this.details.settings.size || s.baseSize);
	// 	try {
	// 		size.x = Number(size.x);
	// 		size.y = Number(size.y);
	// 		size.z = Number(size.z || this.details.settings.zHeight || this.details.settings.wallZHeight || s.baseSize.z || 0);
	// 	} catch (e) {
	// 		console.log(this);
	// 		console.error(e);
	// 	}
	// 	const inputArea = new Phaser.Rectangle(0, 0, size.x, size.y);
	//
	// 	this.collisionBitmap = this.game.make.bitmapData(inputArea.width, inputArea.height + size.z);
	// 	const context = this.collisionBitmap.context;
	// 	const outline = 'rgba(0,0,0,1)';
	//
	// 	const bottomRect = new Phaser.Rectangle(0, size.z, inputArea.width, inputArea.height - 1);
	//
	// 	// show middle and top part only if entity is not flat
	// 	if (size.z > 0) {
	// 		const middleRect = new Phaser.Rectangle(0, inputArea.height, inputArea.width, size.z - 1);
	// 		Helper.drawRect(context, middleRect, 'rgba(255, 40, 40, 0.5)', outline);
	//
	// 		const topRect = new Phaser.Rectangle(0, 0, inputArea.width, inputArea.height);
	// 		Helper.drawRect(context, topRect, 'rgba(255, 255, 40, 1)', outline);
	//
	// 		Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 0.1)', outline);
	// 	} else {
	// 		Helper.drawRect(context, bottomRect, 'rgba(255, 255, 40, 1)', outline);
	// 	}
	//
	// 	const collImg = this.collisionImage;
	// 	collImg.x = inputArea.x;
	// 	collImg.y = inputArea.y - (size.z || 0);
	// 	collImg.loadTexture(this.collisionBitmap);
	//
	// 	this.generateText(this.details.settings.name, size);
	// }
	//
	// private generateText(name: string, size: Point) {
	// 	if (name) {
	// 		if (!this.text) {
	// 			this.text = this.game.add.text(0, 0, '', {
	// 				font: '400 18pt Roboto',
	// 				fill: 'white',
	// 				stroke: 'black',
	// 				strokeThickness: 2
	// 			}, this.levelOffsetGroup);
	// 			this.text.scale.set(0.274);
	// 			this.text.anchor.set(0.5, 0.5);
	// 		}
	// 		this.text.setText(name);
	// 		this.text.position.set(size.x / 2, size.y / 2);
	// 	} else if (this.text) {
	// 		this.text.destroy();
	// 		this.text = null;
	// 	}
	//
	// }
}
