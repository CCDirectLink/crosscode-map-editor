import {CCMap} from '../tilemap/cc-map';
import {MapEntity, Point, Point3} from '../../../models/cross-code-map';
import {Helper} from '../helper';
import * as Phaser from 'phaser';
import {Vec2} from '../vec2';

import {Globals} from '../../globals';
import {BaseObject} from '../BaseObject';

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

export abstract class CCEntity extends BaseObject {
	
	// TODO
	private map: CCMap;
	private levelOffset = 0;
	
	public container!: Phaser.GameObjects.Container;
	
	private text?: Phaser.GameObjects.Text;
	private images: Phaser.GameObjects.Image[] = [];
	
	
	// // input (is handled mostly by entity manager)
	private collisionImage!: Phaser.GameObjects.Graphics;
	private inputZone!: Phaser.GameObjects.Zone;
	
	private selected = false;
	
	// drag
	public isDragged = false;
	public startOffset: Point = {x: 0, y: 0};
	
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
				scaleX?: number;
				scaleY?: number;
				renderHeight?: number;
				offsetX?: number;
				offsetY?: number;
				flipX?: boolean;
				flipY?: boolean;
				tint?: number;
				alpha?: number;
			}[],
			offset?: Point;
			renderMode?: string;
			flipX?: boolean;
		}
		scalableX: boolean;
		scalableY: boolean;
		scalableStep: number;
		pivot: Point;
	} = <any>{};
	
	protected constructor(scene: Phaser.Scene, map: CCMap, x: number, y: number, typeName: string) {
		super(scene, typeName, false);
		scene.add.existing(this);
		this.map = map;
		this.container.x = Math.round(x);
		this.container.y = Math.round(y);
		this.details = <any>{
			type: typeName
		};
	}
	
	
	protected init(): void {
		this.container = <any>this.scene.add.container(0, 0);
		
		const collImg = this.scene.add.graphics();
		this.container.add(collImg);
		this.collisionImage = collImg;
		
		collImg.alpha = 0;
		
		this.inputZone = this.scene.add.zone(0, 0, 50, 50);
		this.inputZone.setOrigin(0);
		this.inputZone.setData('entity', this);
		this.container.add(this.inputZone);
		
		
		this.inputZone.on('pointerover', () => this.inputOver());
		this.inputZone.on('pointerout', () => this.inputOut());
	}
	
	
	public inputOver() {
		if (!this.selected) {
			this.collisionImage.alpha = 0.35;
		}
	}
	
	public inputOut() {
		if (!this.selected) {
			this.collisionImage.alpha = 0;
		}
	}
	
	protected activate(): void {
		this.inputZone.setInteractive();
	}
	
	
	protected deactivate(): void {
		this.inputZone.disableInteractive();
	}
	
	
	preUpdate(time: number, delta: number): void {
		if (this.isDragged) {
			const container = this.container;
			const p = this.scene.input.activePointer;
			container.x = Math.round(p.worldX - this.startOffset.x);
			container.y = Math.round(p.worldY - this.startOffset.y);
			
			const settings = Globals.entitySettings;
			if (settings.enableGrid) {
				const diffX = container.x % settings.gridSize;
				if (diffX * 2 < settings.gridSize) {
					container.x -= diffX;
				} else {
					container.x += settings.gridSize - diffX;
				}
				
				const diffY = container.y % settings.gridSize;
				if (diffY * 2 < settings.gridSize) {
					container.y -= diffY;
				} else {
					container.y += settings.gridSize - diffY;
				}
			}
			this.updateZIndex();
		}
	}
	
	updateSettings() {
		const s = this.entitySettings;
		const settings = this.details.settings;
		
		this.images.forEach(img => this.container.remove(img, true));
		this.images = [];
		
		// bound box offset
		const boundBoxOffset = {x: 0, y: 0};
		if (s.baseSize) {
			boundBoxOffset.x = s.baseSize.x / 2;
			boundBoxOffset.y = s.baseSize.y;
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
						const img = this.scene.add.image(x, -y + settings.size.y, fix.gfx);
						img.setCrop(fix.x, fix.y, imgWidth, imgHeight);
						
						img.setOrigin(0, 0);
						
						// level offset
						img.y += this.levelOffset;
						
						// origin offset x=0, y=1
						img.y -= imgHeight;
						
						// crop offset
						img.x -= fix.x;
						img.y -= fix.y;
						
						this.container.add(img);
						this.images.push(img);
					}
				}
			} else {
				// default
				s.sheets.fix.forEach(sheet => {
					sheet.x = sheet.x || 0;
					sheet.y = sheet.y || 0;
					sheet.offsetX = sheet.offsetX || 0;
					sheet.offsetY = sheet.offsetY || 0;
					
					const img = this.scene.add.image(sheet.offsetX, sheet.offsetY, sheet.gfx);
					img.setOrigin(0, 0);
					
					if (sheet.tint !== undefined) {
						img.setTintFill(sheet.tint);
					}
					
					img.alpha = sheet.alpha || 1;
					
					// scale, used for single color
					img.scaleX = sheet.scaleX || 1;
					img.scaleY = sheet.scaleY || 1;
					
					// level offset
					img.y += this.levelOffset;
					
					// origin offset x=0.5, y=1
					img.x -= sheet.w / 2;
					img.y -= sheet.h;
					
					// bounding box offset
					img.x += boundBoxOffset.x;
					img.y += boundBoxOffset.y;
					
					// flip crop offset
					let cropX = sheet.x;
					if (sheet.flipX) {
						cropX = img.displayWidth - sheet.x - sheet.w;
					}
					
					let cropY = sheet.y;
					if (sheet.flipY) {
						// TODO: untested
						cropY = img.displayWidth - sheet.y - sheet.h;
					}
					
					// crop offset
					img.x -= cropX;
					img.y -= cropY;
					
					img.setCrop(cropX, cropY, sheet.w, sheet.h);
					img.flipX = !!sheet.flipX;
					img.flipY = !!sheet.flipY;
					this.container.add(img);
					this.images.push(img);
				});
				
				if (s.sheets.offset) {
					this.images.forEach(img => Vec2.add(img, s.sheets.offset!));
				}
				if (s.sheets.flipX) {
					this.images.forEach(img => img.flipX = !img.flipX);
				}
			}
			
			if (s.sheets.renderMode === 'lighter') {
				this.images.forEach(img => img.blendMode = Phaser.BlendModes.ADD);
			} else if (s.sheets.renderMode === 'source-over') {
				// TODO: no idea what that actually is
				console.warn('renderMode source-over found');
			}
		}
		
		this.container.bringToTop(this.collisionImage);
		if (this.text) {
			this.container.bringToTop(this.text);
		}
		
		this.drawBoundingBox();
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
		this.updateSettings();
	}
	
	// TODO: refactor
	setSettings(settings: any) {
		this.details.settings = settings;
		this.updateType();
	}
	
	setSelected(selected: boolean) {
		this.selected = selected;
		if (this.collisionImage) {
			this.collisionImage.alpha = selected ? 0.6 : 0;
		}
		if (!selected) {
			this.isDragged = false;
		}
	}
	
	destroy() {
		super.destroy();
		this.container.destroy();
		if (this.text) {
			this.text.destroy();
		}
	}
	
	updateZIndex() {
		let zIndex = this.details.level.level * 10 + 1;
		
		// TODO: hack to display OLPlatform over objects because right now Object Layer is always on level 10
		if (this.details.type === 'OLPlatform' || this.details.type === 'ObjectLayerView') {
			zIndex += 100;
		}
		
		// sort entities by y when on same level
		zIndex += this.container.y * 0.000001;
		
		this.container.depth = zIndex;
	}
	
	exportEntity(): MapEntity {
		const out = {
			type: this.details.type,
			x: this.container.x,
			y: this.container.y,
			level: this.details.level.offset ? this.details.level : this.details.level.level,
			settings: this.details.settings
		};
		return JSON.parse(JSON.stringify(out));
	}
	
	public abstract getScaleSettings(): ScaleSettings | undefined;
	
	public abstract getAttributes(): EntityAttributes;
	
	protected abstract setupType(settings: any): void;
	
	public updateType() {
		const settings = this.details.settings;
		this.setupType(settings);
	}
	
	public generateNoImageType(rgbTop = 0xc06040, aTop = 0.5, rgb = 0x800000, a = 0.5) {
		const settings = this.details.settings;
		
		const baseSize = settings.size || {x: 16, y: 16};
		baseSize.z = settings.zHeight || settings.wallZHeight || 0;
		
		this.entitySettings = <any>{};
		this.entitySettings.baseSize = baseSize;
		const scaleSettings = this.getScaleSettings();
		if (scaleSettings && (scaleSettings.scalableX || scaleSettings.scalableY)) {
			this.entitySettings.scalableX = scaleSettings.scalableX;
			this.entitySettings.scalableY = scaleSettings.scalableY;
		}
		
		
		this.generateSingleColorSheet(rgb, a, rgbTop, aTop);
		this.updateSettings();
	}
	
	private generateSingleColorSheet(rgb: number, a: number, rgbTop?: number, aTop?: number) {
		const size = this.getActualSize();
		
		if (rgbTop === undefined) {
			rgbTop = rgb;
		}
		if (aTop === undefined) {
			aTop = a;
		}
		
		if (!size.z) {
			this.entitySettings.sheets = {
				fix: [{
					gfx: 'pixel',
					x: 0,
					y: 0,
					w: size.x,
					h: size.y,
					scaleX: size.x,
					scaleY: size.y,
					tint: rgbTop,
					alpha: a
				}],
			};
		} else {
			this.entitySettings.sheets = {
				fix: [{
					gfx: 'pixel',
					x: 0,
					y: 0,
					w: size.x,
					h: size.z,
					scaleX: size.x,
					scaleY: size.z,
					tint: rgb,
					alpha: a
				}, {
					gfx: 'pixel',
					x: 0,
					y: 0,
					offsetY: -size.z,
					w: size.x,
					h: size.y,
					scaleX: size.x,
					scaleY: size.y,
					tint: rgbTop,
					alpha: aTop
				}],
			};
		}
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
	
	public getBoundingBox(): Phaser.Geom.Rectangle {
		if (!this.inputZone.input) {
			console.warn('no bounding box for: ' + this.details.type);
			return new Phaser.Geom.Rectangle(0, 0, 0, 0);
		}
		const hitArea = this.inputZone.input.hitArea;
		const box = new Phaser.Geom.Rectangle(
			this.inputZone.x + this.container.x,
			this.inputZone.y + this.container.y,
			hitArea.width,
			hitArea.height
		);
		return box;
	}
	
	private getActualSize() {
		const s = this.entitySettings;
		const size = Object.assign({}, this.details.settings.size || s.baseSize);
		try {
			size.x = Number(size.x);
			size.y = Number(size.y);
			size.z = Number(size.z || this.details.settings.zHeight || this.details.settings.wallZHeight || (s.baseSize ? s.baseSize.z || 0 : 0));
		} catch (e) {
			console.log(this);
			console.error(e);
		}
		
		return size;
	}
	
	private drawBoundingBox() {
		const collImg = this.collisionImage;
		
		collImg.clear();
		
		const size = this.getActualSize();
		
		const inputArea = new Phaser.Geom.Rectangle(0, 0, size.x, size.y);
		
		const outline = 0;
		const outlineAlpha = 1;
		
		const bottomRect = new Phaser.Geom.Rectangle(0, size.z, inputArea.width, inputArea.height - 1);
		
		// show middle and top part only if entity is not flat
		if (size.z > 0) {
			const middleRect = new Phaser.Geom.Rectangle(0, inputArea.height, inputArea.width, size.z - 1);
			Helper.drawRect(collImg, middleRect, 0xff0707, 0.5, outline, outlineAlpha);
			
			const topRect = new Phaser.Geom.Rectangle(0, 0, inputArea.width, inputArea.height);
			Helper.drawRect(collImg, topRect, 0xffff07, 1, outline, outlineAlpha);
			
			Helper.drawRect(collImg, bottomRect, 0xffff07, 0.1, outline, outlineAlpha);
		} else {
			Helper.drawRect(collImg, bottomRect, 0xffff07, 1, outline, outlineAlpha);
		}
		
		collImg.x = inputArea.x;
		collImg.y = inputArea.y - (size.z || 0) + this.levelOffset;
		
		const shape = new Phaser.Geom.Rectangle(0, 0, size.x, size.y + (size.z || 0));
		
		this.inputZone.x = collImg.x;
		this.inputZone.y = collImg.y;
		this.inputZone.setSize(shape.width, shape.height, true);
		
		this.generateText(this.details.settings.name, size);
	}
	
	private generateText(name: string, size: Point) {
		if (name) {
			if (!this.text) {
				this.text = this.scene.add.text(0, 0, '', {
					font: '400 18pt Roboto',
					fill: 'white',
				});
				this.text.setOrigin(0.5, 0.5);
				this.text.setScale(0.3);
				this.container.add(this.text);
			}
			this.text.setText(name);
			this.text.setPosition(size.x / 2, size.y / 2 + this.levelOffset);
		} else if (this.text) {
			this.text.destroy();
			this.text = undefined;
		}
		
	}
}
