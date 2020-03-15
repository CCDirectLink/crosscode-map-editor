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
			
			const width = img.w / Globals.TILE_SIZE;
			const height = img.h / Globals.TILE_SIZE;
			
			const uvs = this.calculateUvs(material.diffuseTexture!, img);
			const m = MeshBuilder.CreatePlane('', {
				width: width,
				height: height,
				sideOrientation: Mesh.DOUBLESIDE,
				frontUVs: uvs,
				backUVs: uvs
			}, scene);
			m.billboardMode = Mesh.BILLBOARDMODE_Y;
			
			m.material = material;
			
			const pos = this.posFromEntity(entity, img);
			m.position.copyFromFloats(pos.x, pos.z, -pos.y);
			m.position.addInPlaceFromFloats(0, height / 2, 0);
		}
	}
	
	// z = height
	private posFromEntity(entity: CCEntity, fix: EntitySettingsFix) {
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
		if (fix.renderMode === 'lighter') {
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
	
	private calculateUvs(texture: BaseTexture, fix: EntitySettingsFix) {
		const size = texture.getSize();
		
		return new Vector4(
			fix.w + fix.x,
			size.height - (fix.h + fix.y),
			fix.x,
			size.height - fix.y,
		).multiplyByFloats(1 / size.width, 1 / size.height, 1 / size.width, 1 / size.height);
	}
}
