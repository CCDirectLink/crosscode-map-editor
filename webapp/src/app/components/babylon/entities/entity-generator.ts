import {CCEntity, Fix} from '../../../shared/phaser/entities/cc-entity';
import {
	ActionManager,
	BaseTexture,
	Color3,
	Color4,
	Engine,
	ExecuteCodeAction,
	ISize,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Texture,
	Vector3,
	Vector4
} from '@babylonjs/core';
import {Globals} from '../../../shared/globals';
import {EntityManager3d} from './entity-manager-3d';

interface Dimensions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export class EntityGenerator {
	
	private entityManager: EntityManager3d;
	
	constructor(entityManager: EntityManager3d) {
		this.entityManager = entityManager;
	}
	
	async generateEntity(entity: CCEntity, scene: Scene) {
		const fix = entity.entitySettings.sheets.fix;
		if (!fix || fix.length === 0) {
			throw new Error('entity has no graphics (fix)');
		}
		
		for (const img of fix) {
			let material: StandardMaterial;
			if (img.gfx === 'pixel') {
				material = this.makePixelMaterial(entity, img, scene);
			} else {
				material = await this.makeMaterial(entity, img, scene);
			}
			
			const m = this.generateMesh(entity, img, material, scene);
			m.edgesWidth = 0;
			m.edgesColor = new Color4(1, 1, 0, 1);
			m.enableEdgesRendering();
			m.actionManager = new ActionManager(scene);
			m.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
				this.entityManager.onClick(m);
			}));
			
			this.entityManager.registerEntity(entity, m);
		}
	}
	
	private generateMesh(entity: CCEntity, fix: Fix, material: StandardMaterial, scene: Scene) {
		const actualSize = entity.getActualSize();
		if (
			actualSize.x === fix.w && actualSize.y + actualSize.z === fix.h ||
			entity.entitySettings.scalableY ||
			actualSize.x === fix.w && actualSize.x !== actualSize.y
		) {
			return this.generateBox(entity, fix, material, scene);
		} else {
			return this.generatePlane(entity, fix, material, scene);
		}
	}
	
	private generatePlane(entity: CCEntity, fix: Fix, material: StandardMaterial, scene: Scene) {
		const width = fix.w / Globals.TILE_SIZE;
		const height = fix.h / Globals.TILE_SIZE;
		
		let fullWidth = width;
		if (entity.entitySettings.scalableX) {
			fullWidth = entity.details.settings.size.x / Globals.TILE_SIZE;
		}
		
		const meshes: Mesh[] = [];
		
		for (let start = 0; start < fullWidth; start += width) {
			const currWidth = Math.min(fullWidth - start, width);
			const customFix = {
				x: fix.x,
				y: fix.y,
				w: currWidth * Globals.TILE_SIZE,
				h: fix.h
			};
			
			const uvs = this.calculateUvs(material.diffuseTexture, customFix, entity.entitySettings.scalableX);
			
			const mesh = MeshBuilder.CreatePlane('', {
				width: currWidth,
				height: height,
				sideOrientation: Mesh.DOUBLESIDE,
				frontUVs: uvs,
				backUVs: uvs
			}, scene);
			
			if (fullWidth === width) {
				mesh.billboardMode = Mesh.BILLBOARDMODE_Y;
			}
			const pos = this.posFromEntity(entity);
			mesh.position.copyFromFloats(pos.x, pos.z, -pos.y);
			mesh.position.addInPlaceFromFloats(0, height / 2, 0);
			mesh.position.addInPlaceFromFloats(start + (currWidth - width) / 2, 0, 0);
			mesh.material = material;
			meshes.push(mesh);
		}
		
		if (meshes.length === 1) {
			return meshes[0];
		} else {
			return Mesh.MergeMeshes(meshes)!;
		}
	}
	
	
	// TODO: babylon introduced MeshBuilder.CreateTiledBox with a new version,
	//  but the new version requires a typescript update.
	//  To update typescript we also need to update angular.
	//  So after angular is on version >= 9 we can try to add this,
	//  for now the textures are broken with scalable entities
	private generateBox(entity: CCEntity, fix: Fix, material: StandardMaterial, scene: Scene) {
		const width = fix.w / Globals.TILE_SIZE;
		const height = fix.h / Globals.TILE_SIZE;
		
		const size = entity.getActualSize();
		
		size.z = Math.max(0.01, size.z);
		
		const scaledSize = {
			x: size.x / Globals.TILE_SIZE,
			y: size.y / Globals.TILE_SIZE,
			z: size.z / Globals.TILE_SIZE,
		};
		
		const uvs = this.calculateBoxUvs(material.diffuseTexture, fix, size.y, fix.flipX);
		
		const mesh = MeshBuilder.CreateBox('', {
			width: scaledSize.x,
			height: scaledSize.z,
			depth: scaledSize.y,
			faceUV: uvs,
			// sideOrientation: Mesh.DOUBLESIDE,
			// @ts-ignore
			wrap: true
		}, scene);
		
		const pos = this.posFromEntity(entity);
		mesh.position.copyFromFloats(entity.container.x / Globals.TILE_SIZE, pos.z, -entity.container.y / Globals.TILE_SIZE);
		mesh.position.addInPlaceFromFloats(scaledSize.x / 2, scaledSize.z / 2, -scaledSize.y / 2);
		mesh.position.addInPlaceFromFloats(0, 0, 1 / Globals.TILE_SIZE);
		mesh.material = material;
		
		return mesh;
	}
	
	// z = height
	private posFromEntity(entity: CCEntity) {
		const level = entity.details.level;
		
		let levelObj = Globals.map.levels[level.level];
		if (!levelObj) {
			// TODO: check why it's actually not defined
			levelObj = {height: 0};
		}
		
		const out = new Vector3(
			entity.container.x,
			entity.container.y,
			levelObj.height + level.offset
		);
		
		// bounding box offset
		const boundBoxOffset = {x: 0, y: 0};
		if (entity.entitySettings.baseSize) {
			boundBoxOffset.x = entity.entitySettings.baseSize.x / 2;
			boundBoxOffset.y = entity.entitySettings.baseSize.y;
		}
		
		out.addInPlaceFromFloats(
			boundBoxOffset.x,
			boundBoxOffset.y,
			0
		);
		out.scaleInPlace(1 / Globals.TILE_SIZE);
		
		return out;
	}
	
	private async makeMaterial(entity: CCEntity, fix: Fix, scene: Scene) {
		const material = new StandardMaterial(fix.gfx, scene);
		const texture = await this.loadTexture(Globals.URL + fix.gfx, scene);
		// texture.wrapU = Texture.CLAMP_ADDRESSMODE;
		// texture.wrapV = Texture.CLAMP_ADDRESSMODE;
		texture.hasAlpha = true;
		material.diffuseTexture = texture;
		if (fix.renderMode === 'lighter' || entity.entitySettings.sheets.renderMode === 'lighter') {
			material.alphaMode = Engine.ALPHA_ADD;
			material.opacityTexture = texture;
		}
		
		return material;
	}
	
	private makePixelMaterial(entity: CCEntity, fix: Fix, scene: Scene) {
		const material = new StandardMaterial('pixel' + fix.tint, scene);
		
		const color = fix.tint || 0;
		
		const b = color % 256;
		const g = ((color - b) / 256) % 256;
		const r = ((color - b) / 256 ** 2) - g / 256;
		
		material.diffuseColor = new Color3(r / 255, g / 255, b / 255);
		material.alpha = fix.alpha || 0;
		if (fix.renderMode === 'lighter' || entity.entitySettings.sheets.renderMode === 'lighter') {
			material.alphaMode = Engine.ALPHA_ADD;
		}
		
		return material;
	}
	
	private async loadTexture(url: string, scene: Scene) {
		return new Promise<Texture>((res, rej) => {
			const texture = new Texture(url, scene, undefined, undefined, Texture.NEAREST_SAMPLINGMODE, () => {
				res(texture);
			}, rej);
		});
	}
	
	private calculateUvs(texture: BaseTexture | null, fix: Dimensions, flipX = false, flipY = false) {
		let size: ISize;
		if (texture) {
			size = texture.getSize();
		} else {
			size = {
				height: 1,
				width: 1
			};
		}
		
		let out: Vector4;
		const u = fix.w + fix.x;
		const v = size.height - (fix.h + fix.y);
		const u2 = fix.x;
		const v2 = size.height - fix.y;
		
		out = new Vector4(u, v, u2, v2);
		if (flipX) {
			out = new Vector4(u2, v, u, v2);
		}
		
		return out.multiplyByFloats(1 / size.width, 1 / size.height, 1 / size.width, 1 / size.height);
	}
	
	private calculateBoxUvs(texture: BaseTexture | null, fix: Dimensions, depth: number, flipX = false) {
		let box = fix.w === depth;
		
		// always use box, looks better most of the time
		box = true;
		
		const front = this.calculateUvs(texture, {
			x: fix.x,
			y: fix.y + depth,
			w: fix.w,
			h: fix.h - depth,
		}, !flipX, false);
		
		const back = this.calculateUvs(texture, {
			x: fix.x,
			y: fix.y + depth,
			w: fix.w,
			h: fix.h - depth,
		}, flipX, false);
		
		let right = this.calculateUvs(texture, {
			x: fix.x + fix.w - 1,
			y: fix.y + depth,
			w: 1,
			h: fix.h - depth,
		}, !flipX, false);
		
		let left = this.calculateUvs(texture, {
			x: fix.x,
			y: fix.y + depth,
			w: 1,
			h: fix.h - depth,
		}, !flipX, false);
		
		// needs to be rotated 90°
		const top = this.calculateUvs(texture, {
			x: fix.x,
			y: fix.y,
			w: fix.w,
			h: fix.h - (fix.h - depth),
		}, !flipX, false);
		
		const tmpX = top.x;
		
		const bottom = this.calculateUvs(texture, {
			x: fix.x,
			y: fix.y,
			w: fix.w,
			h: fix.h,
		}, true, false);
		
		if (flipX) {
			const tmp = left;
			left = right;
			right = tmp;
		}
		
		if (box) {
			return [
				back, // back,
				front, // front
				front, // right,
				front, // left,
				top, // top
				bottom, // bottom
			];
		} else {
			return [
				back, // back,
				front, // front
				right, // right,
				left, // left,
				top, // top
				bottom, // bottom
			];
		}
	}
}
