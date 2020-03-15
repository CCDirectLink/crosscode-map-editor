import {CCEntity, EntitySettingsFix} from '../../../shared/phaser/entities/cc-entity';
import {
	BaseTexture,
	Engine,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Texture,
	Vector3,
	Vector4
} from '@babylonjs/core';
import {Globals} from '../../../shared/globals';

interface Dimensions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export class EntityGenerator {
	async generateEntity(entity: CCEntity, scene: Scene) {
		const fix = entity.entitySettings.sheets.fix;
		if (!fix || fix.length === 0) {
			throw new Error('entity has no graphics (fix)');
		}
		
		for (const img of fix) {
			// TODO diffuse color https://doc.babylonjs.com/babylon101/materials#diffuse-color-example
			if (img.gfx === 'pixel') {
				continue;
			}
			const material = await this.makeMaterial(entity, img, scene);
			
			const m = this.generateMesh(entity, img, material, scene);
		}
	}
	
	private generateMesh(entity: CCEntity, fix: EntitySettingsFix, material: StandardMaterial, scene: Scene) {
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
			
			const uvs = this.calculateUvs(material.diffuseTexture!, customFix, entity.entitySettings.scalableX);
			
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
		
		return meshes;
	}
	
	// z = height
	private posFromEntity(entity: CCEntity) {
		const level = entity.details.level;
		
		const out = new Vector3(
			entity.container.x,
			entity.container.y,
			Globals.map.levels[level.level].height + level.offset
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
	
	private async makeMaterial(entity: CCEntity, fix: EntitySettingsFix, scene: Scene) {
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
	
	private async loadTexture(url: string, scene: Scene) {
		return new Promise<Texture>((res, rej) => {
			const texture = new Texture(url, scene, undefined, undefined, Texture.NEAREST_SAMPLINGMODE, () => {
				res(texture);
			}, rej);
		});
	}
	
	private calculateUvs(texture: BaseTexture, fix: Dimensions, flipX = false, flipY = false) {
		const size = texture.getSize();
		
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
}
