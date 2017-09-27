import {Sortable, SortableGroup} from '../../interfaces/sortable';
import {CCMap} from '../tilemap/cc-map';
import {Prop, PropSheet, ScalableProp, ScalablePropSheet} from '../../interfaces/props';
import {MapEntity, Point, Point3} from '../../interfaces/cross-code-map';
import {Helper} from '../helper';
import * as Phaser from 'phaser-ce';
import {EntityDefinition} from '../../interfaces/entity-definition';
import {Vec2} from '../vec2';
import {max} from 'rxjs/operator/max';
import {Globals} from '../../globals';

export interface InputEvents {
	onLeftClick?: (entity: CCEntity, pointer: Phaser.Pointer) => void;
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
	
	// for normal entities
	private entityBitmap: Phaser.BitmapData;
	
	// for resizeable entities
	private tileSprite: Phaser.TileSprite;
	private tileSpriteBitmap: Phaser.BitmapData;
	
	// input (is handled mostly by entity manager)
	private collisionBitmap: Phaser.BitmapData;
	public collisionImage: Phaser.Image;
	private inputEvents: InputEvents = {};
	private selected = false;
	private leftClickOpts: {
		timer?: number;
		pos?: Point;
	} = {};
	
	// drag
	public isDragged = false;
	public startOffset: Point = {};
	
	zIndex: number;
	details: { level: { level: number, offset: number }, type: string, settings: any };
	entitySettings: {
		collType: string;
		baseSize: Point3;
		sheets: {
			fix: {
				gfx: string | Phaser.BitmapData;
				x: number;
				y: number;
				w: number;
				h: number;
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
		
		// const testimg = game.add.image(0, 0, 'media/entity/objects/block.png', undefined, this.group);
		// testimg.crop(new Phaser.Rectangle(10, 20, 5, 5));
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
		if (s.sheets && s.sheets.fix) {
			if (s.scalableX || s.scalableY) {
				// scalable
				const fix = s.sheets.fix[0];
				if (this.tileSpriteBitmap) {
					this.tileSpriteBitmap.destroy();
				}
				this.tileSpriteBitmap = game.make.bitmapData(fix.w, fix.h);
				
				this.loadTexture(fix.gfx);
				this.crop(new Phaser.Rectangle(fix.x, fix.y, fix.w, fix.h));
				
				this.tileSpriteBitmap.draw(this, 0, 0, fix.w, fix.h);
				if (this.tileSprite) {
					this.boundingBoxOffsetGroup.remove(this.tileSprite);
				}
				this.tileSprite = game.make.tileSprite(
					0,
					0,
					settings.size.x,
					settings.size.y + s.baseSize.z,
					this.tileSpriteBitmap, undefined
				);
				this.boundingBoxOffsetGroup.add(this.tileSprite);
				this.boundingBoxOffsetGroup.x = 0;
				this.boundingBoxOffsetGroup.y = -s.baseSize.z;
				this.visible = false;
			} else {
				// default
				
				const minOffset = {x: 0, y: 0};
				const fixCopy = [];
				s.sheets.fix.forEach(sheet => {
					fixCopy.push(Object.assign({}, sheet));
				});
				// normalize
				fixCopy.forEach(sheet => {
					sheet.offsetX = sheet.offsetX || 0;
					sheet.offsetY = sheet.offsetY || 0;
					minOffset.x = Math.min(sheet.offsetX, minOffset.x);
					minOffset.y = Math.min(sheet.offsetY, minOffset.y);
				});
				fixCopy.forEach(sheet => {
					sheet.offsetX -= minOffset.x;
					sheet.offsetY -= minOffset.y;
				});
				
				const maxSize = {x: 0, y: 0};
				fixCopy.forEach(sheet => {
					maxSize.x = Math.max(sheet.w + sheet.offsetX, maxSize.x);
					maxSize.y = Math.max(sheet.h + sheet.offsetY, maxSize.y);
				});
				if (this.entityBitmap) {
					this.entityBitmap.destroy();
				}
				this.entityBitmap = this.game.make.bitmapData(maxSize.x, maxSize.y);
				const bmp = this.entityBitmap;
				const img = this.game.make.image(0, 0);
				fixCopy.forEach(sheet => {
					img.loadTexture(sheet.gfx);
					img.crop(new Phaser.Rectangle(sheet.x, sheet.y, sheet.w, sheet.h));
					img.x = sheet.offsetX;
					img.y = sheet.offsetY;
					img.anchor.set(0, 0);
					img.scale.set(1, 1);
					if (sheet.flipY) {
						img.anchor.y = 1;
						img.scale.y = -1;
					}
					if (sheet.flipX) {
						img.anchor.x = 1;
						img.scale.x = -1;
					}
					bmp.draw(img);
				});
				img.destroy();
				
				this.loadTexture(bmp);
				Vec2.assign(this, minOffset);
				if (s.sheets.offset) {
					Vec2.add(this, s.sheets.offset);
				}
				if (s.sheets.flipX) {
					Vec2.mulF(this, -1);
				}
				
				// flip image
				this.scale.x = s.sheets.flipX ? -1 : 1;
			}
			
			if (s.sheets.renderMode === 'lighter') {
				if (this.tileSprite) {
					this.tileSprite.blendMode = PIXI.blendModes.ADD;
				}
				this.blendMode = PIXI.blendModes.ADD;
			} else if (s.sheets.renderMode === 'source-over') {
				// TODO: no idea what that actually is
				console.warn('renderMode source-over found');
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
		if (enable) {
			this.collisionImage.input.priorityID = 10;
		}
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
		if (this.tileSpriteBitmap) {
			this.tileSpriteBitmap.destroy();
		}
		if (this.collisionBitmap) {
			this.collisionBitmap.destroy();
		}
		super.destroy();
	}
	
	update() {
		super.update();
		this.leftClickOpts.timer += this.game.time.elapsed;
		if (this.isDragged) {
			const p = Helper.screenToWorld(this.game.input.mousePointer);
			this.group.x = Math.round(p.x - this.startOffset.x);
			this.group.y = Math.round(p.y - this.startOffset.y);
			
			const settings = Globals.entitySettings;
			if (settings.enableGrid) {
				const diffX = this.group.x % settings.gridSize;
				if (diffX * 2 < settings.gridSize) {
					this.group.x -= diffX;
				} else {
					this.group.x += settings.gridSize - diffX;
				}
				
				const diffY = this.group.y % settings.gridSize;
				if (diffY * 2 < settings.gridSize) {
					this.group.y -= diffY;
				} else {
					this.group.y += settings.gridSize - diffY;
				}
			}
			this.updateZIndex();
		}
	}
	
	updateZIndex() {
		let zIndex = this.details.level.level * 10 + 1;
		
		// TODO: hack to display OLPlatform over objects because right now Object Layer is always on level 10
		if (this.details.type === 'OLPlatform') {
			zIndex += 100;
		}
		
		// sort entities by y when on same level
		zIndex += this.group.y * 0.000001;
		
		this.group.zIndex = zIndex;
	}
	
	exportEntity(): MapEntity {
		const out = {
			type: this.details.type,
			x: this.group.x,
			y: this.group.y,
			level: this.details.level.offset ? this.details.level : this.details.level.level,
			settings: this.details.settings
		};
		return JSON.parse(JSON.stringify(out));
	}
	
	updateType() {
		const type = this.details.type;
		const settings = this.details.settings;
		// load correct image if prop
		if (type === 'Prop' && settings.propType) {
			Helper.getJson('data/props/' + settings.propType.sheet, (sheet) => {
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
				
				this.entitySettings = <any>{sheets: {fix: []}};
				if (prop.fix) {
					this.entitySettings.sheets.fix[0] = prop.fix;
					this.entitySettings.sheets.renderMode = prop.fix.renderMode;
				} else {
					console.log('sheet not found for prop: ' + prop.name);
					console.log(this.group.x);
					console.log(this.group.y);
					return this.generateUndefinedType(0, 255, 60);
				}
				this.entitySettings.baseSize = prop.size;
				this.entitySettings.collType = prop.collType;
				this.updateSettings();
			});
		} else if (type === 'ScalableProp' && settings.propConfig) {
			Helper.getJson('data/scale-props/' + settings.propConfig.sheet, (sheet) => {
				let prop: ScalableProp = sheet.entries[settings.propConfig.name];
				if (!prop) {
					console.error('scale-prop not found: ' + settings.propConfig.name);
					return this.generateUndefinedType();
				}
				
				this.entitySettings = <any>{};
				if (prop.jsonINSTANCE) {
					const jsonInstance = sheet.jsonTEMPLATES[prop.jsonINSTANCE];
					const p = jsonInstance.patterns;
					this.replaceJsonParams(jsonInstance, prop);
					prop = jsonInstance;
				}
				
				if (prop.gfx) {
					this.entitySettings.sheets = {
						fix: [{
							gfx: prop.gfx,
							x: prop.gfxBaseX + prop.patterns.x,
							y: prop.gfxBaseY + prop.patterns.y,
							w: prop.patterns.w,
							h: prop.patterns.h
						}],
						renderMode: prop.renderMode,
						flipX: false,
					};
				}
				this.entitySettings.scalableX = prop.scalableX;
				this.entitySettings.scalableY = prop.scalableY;
				this.entitySettings.scalableStep = prop.scalableStep;
				this.entitySettings.baseSize = prop.baseSize;
				this.entitySettings.collType = prop.collType;
				this.entitySettings.pivot = prop.pivot;
				this.updateSettings();
			});
		} else {
			// other entities;
			const def = this.definition;
			if (!def.definitions && !def.definitionRef) {
				return this.generateUndefinedType();
			}
			
			this.entitySettings = <any>{sheets: {}};
			
			if (def.scalableX || def.scalableY) {
				this.entitySettings.scalableX = def.scalableX;
				this.entitySettings.scalableY = def.scalableY;
			} else {
				this.anchor.y = 1;
				this.anchor.x = 0.5;
			}
			
			if (def.definitionRef) {
				let defKey = def.definitionRef;
				
				let matched: string[] | string;
				
				// replace vars
				while (true) {
					matched = defKey.split('${')[1];
					if (!matched) {
						break;
					}
					matched = matched.split('}');
					if (matched.length === 1) {
						break;
					}
					matched = matched[0];
					let val = Helper.deepFind(matched, settings);
					if (val) {
						val = val.replace('.', '/');
					}
					defKey = defKey.replace('${' + matched + '}', val);
				}
				
				Helper.getJson(defKey, json => {
					if (!json) {
						return this.generateUndefinedType();
					}
					const animKey = 'data/animations/' + json.anims.replace('.', '/');
					Helper.getJson(animKey, anim => {
						const namedSheet = anim.namedSheets.move;
						if (!namedSheet) {
							return this.generateUndefinedType();
						}
						const sheets = this.entitySettings.sheets;
						sheets.fix = [{
							gfx: namedSheet.src,
							x: (namedSheet.offX || 0),
							y: (namedSheet.offY || 0),
							w: namedSheet.width,
							h: namedSheet.height,
						}];
						
						this.entitySettings.baseSize = {x: 16, y: 16, z: Math.abs(namedSheet.height - 16)};
						this.updateSettings();
					});
				});
			} else {
				let attr = settings[def.definitionAttribute];
				
				if (!attr) {
					attr = 'default';
				}
				const entityDef = def.definitions[attr];
				if (!entityDef) {
					return this.generateUndefinedType();
				}
				
				this.entitySettings.baseSize = entityDef.size;
				if (settings.zHeight) {
					this.entitySettings.baseSize.z = settings.zHeight;
				} else if (settings.wallZHeight) {
					this.entitySettings.baseSize.z = settings.wallZHeight;
				}
				
				if (entityDef.fix) {
					this.entitySettings.sheets.fix = entityDef.fix;
					this.entitySettings.sheets.flipX = entityDef.flipX;
					this.entitySettings.sheets.offset = entityDef.offset;
				} else {
					const c = entityDef.color || {r: 150, g: 0, b: 255, a: 0.5};
					this.generateSingleColorSheet(c.r, c.g, c.b, c.a);
				}
				
				this.updateSettings();
			}
		}
	}
	
	private generateUndefinedType(r?: number, g?: number, b?: number, a?: number) {
		const settings = this.details.settings;
		const def = this.definition;
		this.entitySettings = <any>{};
		this.entitySettings.baseSize = {x: 16, y: 16, z: settings.zHeight || settings.wallZHeight || 0};
		if (def.scalableX || def.scalableY) {
			this.entitySettings.scalableX = def.scalableX;
			this.entitySettings.scalableY = def.scalableY;
		} else {
			this.anchor.y = 1;
			this.anchor.x = 0.5;
		}
		this.generateSingleColorSheet(r || 40, g || 60, b || 255);
		this.updateSettings();
	}
	
	private generateSingleColorSheet(r: number, g: number, b: number, a?: number) {
		const size = this.entitySettings.baseSize;
		const singleColor = this.game.make.bitmapData(size.x, size.y);
		singleColor.fill(r, g, b, a || 0.5);
		this.entitySettings.sheets = {
			fix: [{
				gfx: singleColor,
				x: 0,
				y: 0,
				w: size.x,
				h: size.y,
			}],
			singleColor: true,
			flipX: false,
		};
	}
	
	private replaceJsonParams(jsonInstance, prop: ScalableProp) {
		Object.entries(jsonInstance).forEach(([key, value]) => {
			if (value.jsonPARAM) {
				jsonInstance[key] = prop[value.jsonPARAM];
				return;
			}
			if (typeof value === 'object') {
				this.replaceJsonParams(value, prop);
			}
		});
	}
	
	private setInputEvents(inputEvents: InputEvents) {
		const events = this.inputEvents;
		const input = inputEvents;
		events.onInputDown = (o, pointer) => {
			if (pointer.leftButton.isDown) {
				this.leftClickOpts.timer = 0;
				this.leftClickOpts.pos = Vec2.create(pointer);
			}
			if (input.onInputDown) {
				input.onInputDown(this, pointer);
			}
		};
		events.onInputUp = (o, pointer, isOver) => {
			if (input.onInputUp) {
				input.onInputUp(this, pointer, isOver);
			}
			if (isOver && this.leftClickOpts.timer < 200 && Vec2.distance2(pointer, this.leftClickOpts.pos) < 10) {
				if (input.onLeftClick) {
					input.onLeftClick(this, pointer);
				}
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
			if (!this.collisionImage.events[key]) {
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
		try {
			size.z = size.z || this.details.settings.zHeight || this.details.settings.wallZHeight || s.baseSize.z || 0;
		} catch (e) {
			console.log(this);
			console.error(e);
		}
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
}
