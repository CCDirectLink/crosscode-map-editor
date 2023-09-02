import * as Phaser from 'phaser';
import { MapEntity, PartialPoint3, Point, Point3 } from '../../../models/cross-code-map';
import { Helper } from '../helper';
import { CCMap } from '../tilemap/cc-map';
import { Vec2 } from '../vec2';

import { Subscription } from 'rxjs';
import { AbstractWidget } from '../../../components/widgets/abstract-widget';
import { Globals } from '../../globals';
import { BaseObject } from '../base-object';

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
	withNull?: boolean;
	large?: boolean;
	optional?: boolean;
	
	// TODO: not needed anymore, cc source is not obfuscated
	[key: string]: any;
}

export interface DetailSettings {
	mapId: number;
	
	[key: string]: any;
}

export interface Fix {
	gfx: any;
	x: number;
	y: number;
	w: number;
	h: number;
	scaleX?: number;
	scaleY?: number;
	renderHeight?: number;
	renderMode?: string;
	offsetX?: number;
	offsetY?: number;
	flipX?: boolean;
	flipY?: boolean;
	tint?: number;
	alpha?: number;
	
	wallY?: number;
	shape?: string;
	aboveZ?: string | number;
	pivotX?: number;
	pivotY?: number;
	terrain?: string;
	off?: null;
	wall?: number;
	shapeType?: string;
	
	// reduces width/height on scalable props to allow space for end sprites
	offsetWidth?: number;
	offsetHeight?: number;
	scalable?: boolean;
	ignoreBoundingboxX?: boolean;
	ignoreBoundingboxY?: boolean;
}


export abstract class CCEntity extends BaseObject {
	
	private static renderBackground?: Phaser.GameObjects.Graphics;
	
	private map: CCMap;
	private levelOffset = 0;
	
	public container!: Phaser.GameObjects.Container;
	
	private text?: Phaser.GameObjects.Text;
	private images: Phaser.GameObjects.Image[] = [];
	
	private readonly filterSubscription: Subscription;
	
	
	protected widgets: Record<string, AbstractWidget> = {};
	
	// input (is handled mostly by entity manager)
	private collisionImage!: Phaser.GameObjects.Graphics;
	private inputZone!: Phaser.GameObjects.Zone;
	
	private _selected = false;
	
	get selected(): boolean {
		return this._selected;
	}
	
	// drag
	public isDragged = false;
	public startOffset: Point = {x: 0, y: 0};
	
	// zIndex: number;
	details: {
		level: {
			level: number;
			offset: number;
		}; type: string;
		settings: DetailSettings;
	} = <any>{};
	entitySettings: {
		collType?: string;
		baseSize: PartialPoint3;
		sheets: {
			fix: Fix[];
			offset?: Point;
			renderMode?: string;
			flipX?: boolean;
			ignoreScalable?: boolean;
		};
		scalableX?: boolean;
		scalableY?: boolean;
		scalableStep?: number;
		pivot?: Point;
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
		
		this.filterSubscription = Globals.globalEventsService.filterEntity.subscribe(filter => this.setVisible(this.filter(filter)));
	}
	
	
	protected init(): void {
		this.container = this.scene.add.container(0, 0);
		
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
		if (!this._selected) {
			this.collisionImage.alpha = 0.35;
		}
	}
	
	public inputOut() {
		if (!this._selected) {
			this.collisionImage.alpha = 0;
		}
	}
	
	protected activate(): void {
		this.inputZone.setInteractive();
	}
	
	
	protected deactivate(): void {
		this.inputZone.disableInteractive();
	}
	
	
	preUpdate(): void {
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
	
	addPosition(x: number, y: number) {
		this.container.x += x;
		this.container.y += y;
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
			for (const fix of s.sheets.fix) {
				if (!this.scene.textures.exists(fix.gfx.trim())) {
					console.error(`texture not loaded: [${fix.gfx}] in class: [${this.constructor.name}]`);
				}
			}
			
			for (const fix of s.sheets.fix) {
				const gfx = fix.gfx.trim();
				if (!s.sheets.ignoreScalable && (s.scalableX || s.scalableY) && fix.scalable) {
					// scalable
					const offsetX = fix.offsetX ?? 0;
					const offsetY = fix.offsetY ?? 0;
					const offsetWidth = fix.offsetWidth ?? 0;
					const offsetHeight = fix.offsetHeight ?? 0;
					const width = settings['size'].x - offsetX - offsetWidth;
					const height = (fix.renderHeight || s.baseSize.z) + settings['size'].y - offsetY - offsetHeight;
					
					for (let x = 0; x < width; x += fix.w) {
						const imgWidth = Math.min(fix.w, width - x);
						for (let y = 0; y < height; y += fix.h) {
							const imgHeight = Math.min(fix.h, height - y);
							const img = this.scene.add.image(x, -y + settings['size'].y, gfx);
							img.setCrop(fix.x, fix.y, imgWidth, imgHeight);
							
							img.setOrigin(0, 0);
							
							img.alpha = fix.alpha ?? 1;
							
							// level offset
							img.y += this.levelOffset;
							
							// origin offset x=0, y=1
							img.y -= imgHeight;
							
							// crop offset
							img.x -= fix.x;
							img.y -= fix.y;
							
							// fix offset
							img.x += offsetX;
							img.y -= offsetY;
							
							if (fix.renderMode === 'lighter') {
								img.blendMode = Phaser.BlendModes.ADD;
							}
							
							this.container.add(img);
							this.images.push(img);
						}
					}
				} else {
					// default
					
					fix.x = fix.x || 0;
					fix.y = fix.y || 0;
					fix.offsetX = fix.offsetX || 0;
					fix.offsetY = fix.offsetY || 0;
					
					const img = this.scene.add.image(fix.offsetX, fix.offsetY, gfx);
					img.setOrigin(0, 0);
					
					if (fix.tint !== undefined) {
						img.setTintFill(fix.tint);
					}
					
					img.alpha = fix.alpha ?? 1;
					
					// scale, used for single color
					img.scaleX = fix.scaleX || 1;
					img.scaleY = fix.scaleY || 1;
					
					// level offset
					img.y += this.levelOffset;
					
					// bounding box offset
					
					if (!fix.ignoreBoundingboxX) {
						img.x += boundBoxOffset.x;
					}
					if (!fix.ignoreBoundingboxY) {
						img.y += boundBoxOffset.y;
					}
					
					// origin offset x=0.5, y=1
					img.x -= fix.w / 2;
					img.y -= fix.h;
					
					// flip crop offset
					let cropX = fix.x;
					if (fix.flipX) {
						cropX = img.displayWidth - fix.x - fix.w;
					}
					
					let cropY = fix.y;
					if (fix.flipY) {
						// TODO: untested
						cropY = img.displayWidth - fix.y - fix.h;
					}
					
					// crop offset
					img.x -= fix.x;
					img.y -= fix.y;
					
					img.setCrop(cropX, cropY, fix.w, fix.h);
					img.flipX = !!fix.flipX;
					img.flipY = !!fix.flipY;
					
					if (fix.renderMode === 'lighter') {
						img.blendMode = Phaser.BlendModes.ADD;
					}
					
					this.container.add(img);
					this.images.push(img);
				}
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
		Globals.globalEventsService.updateEntitySettings.next(this);
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
	async setSettings(settings: any) {
		this.details.settings = settings;
		await this.updateType();
	}
	
	setSelected(selected: boolean) {
		this._selected = selected;
		if (this.collisionImage) {
			this.collisionImage.alpha = selected ? 0.6 : 0;
		}
		if (!selected) {
			this.isDragged = false;
		}
	}
	
	setWidgets(widgets: Record<string, AbstractWidget>) {
		this.widgets = widgets;
	}
	
	override destroy() {
		super.destroy();
		this.container.destroy();
		this.filterSubscription.unsubscribe();
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
	
	protected abstract setupType(settings: any): Promise<void>;
	
	public doubleClick(): void {
	
	}
	
	public async updateType() {
		const settings = this.details.settings;
		await this.setupType(settings);
		this.setActive(true);
	}
	
	public generateErrorImage() {
		this.generateNoImageType(0xFF0000, 1);
	}
	
	public generateNoImageType(rgbTop = 0xc06040, aTop = 0.5, rgb = 0x800000, a = 0.5) {
		const settings = this.details.settings;
		
		const baseSize: Point3 = {x: 16, y: 16, z: 0};
		if (settings['size']) {
			baseSize.x = settings['size'].x;
			baseSize.y = settings['size'].y;
		}
		
		baseSize.z = settings['zHeight'] || settings['wallZHeight'] || 0;
		
		this.entitySettings = <any>{};
		this.entitySettings.baseSize = baseSize;
		const scaleSettings = this.getScaleSettings();
		if (scaleSettings) {
			if (scaleSettings.scalableX || scaleSettings.scalableY) {
				this.entitySettings.scalableX = scaleSettings.scalableX;
				this.entitySettings.scalableY = scaleSettings.scalableY;
			}
			// check for size overrides
			if (scaleSettings.baseSize.x != scaleSettings.scalableStep) {
				settings['size'].x = scaleSettings.baseSize.x;
			}
			if (scaleSettings.baseSize.y != scaleSettings.scalableStep) {
				settings['size'].y = scaleSettings.baseSize.y;
			}
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
				ignoreScalable: true,
				fix: [{
					gfx: 'pixel',
					x: 0,
					y: 0,
					w: size.x,
					h: size.y,
					scaleX: size.x,
					scaleY: size.y,
					tint: rgbTop,
					alpha: aTop
				}],
			};
		} else {
			this.entitySettings.sheets = {
				ignoreScalable: true,
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
	
	public getActualSize(): Point3 {
		const s = this.entitySettings;
		const size = Object.assign({}, this.details.settings['size'] || s.baseSize);
		try {
			size.x = Number(size.x);
			size.y = Number(size.y);
			if (size.z !== 0) {
				size.z = Number(size.z || this.details.settings['zHeight'] || this.details.settings['wallZHeight'] || (s.baseSize ? s.baseSize.z || 0 : 0));
			}
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
		
		this.generateText(this.details.settings['name'], size);
	}
	
	private generateText(name: string, size: Point) {
		if (name) {
			if (!this.text) {
				this.text = this.scene.add.text(0, 0, '', {
					font: '400 18pt Roboto',
					color: 'white',
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
	
	protected filter(filter: string): boolean {
		const lower = filter.toLocaleLowerCase();
		const attributes = this.getAttributes();
		
		for (const name of Object.keys(attributes)) {
			const value = this.details.settings[name] || '';
			if (typeof value === 'string' && value.toLowerCase().includes(lower)) {
				return true;
			}
		}
		
		return this.details.type.toLowerCase().includes(lower)
			|| (this.details.settings['name'] || '').toLowerCase().includes(lower);
	}
	
	private setVisible(visible: boolean) {
		this.setActive(visible);
		if (visible) {
			this.container.alpha = 1;
		} else {
			this.container.alpha = 0.2;
		}
	}
	
	private getRenderBackground(width: number, height: number) {
		if (!CCEntity.renderBackground) {
			const g = this.scene.add.graphics({fillStyle: {color: 0x616161, alpha: 1}});
			g.fillRect(0, 0, width, height);
			g.fillStyle(0, 0.15);
			for (let x = 0; x < width; x += 16) {
				for (let y = 0; y < height; y += 16) {
					if ((x + y) % 32 === 0) {
						continue;
					}
					g.fillRect(x, y, 16, 16);
				}
			}
			g.setActive(false);
			g.setVisible(false);
			CCEntity.renderBackground = g;
		}
		return CCEntity.renderBackground;
	}
	
	public async generateHtmlImage(withBackground = true, offsetY: number = 0, entityScale = 1) {
		const width = 16 * 6 * entityScale;
		const height = 16 * 7 * entityScale;
		
		const scale = 3;
		
		const name = Math.random() + '';
		const texture = this.scene.textures.addDynamicTexture(name, width * scale, height * scale)!;
		
		texture.clear();
		if (withBackground) {
			const g = this.getRenderBackground(width / entityScale, height / entityScale);
			g.setScale(scale * entityScale);
			texture.draw(g);
		}
		const x = (width - this.getActualSize().x) * scale / 2;
		const y = scale * (height - ((32 - offsetY) * entityScale));
		
		// drawing container directly is broken: https://github.com/photonstorm/phaser/issues/6546
		for (const img of this.images) {
			const sx = img.scaleX;
			const sy = img.scaleY;
			
			img.setScale(
				sx * scale,
				sy * scale
			);
			texture.draw(
				img,
				x + img.x * scale,
				y + img.y * scale
			);
			
			img.setScale(sx, sy);
		}
		const res = await new Promise<HTMLImageElement>((res, rej) => {
			texture!.snapshot(img => {
				res(img as HTMLImageElement);
			});
		});
		
		this.scene.textures.remove(name);
		return res;
	}
}
