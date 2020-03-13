import {Globals} from '../../../shared/globals';
import {CCMapLayer} from '../../../shared/phaser/tilemap/cc-map-layer';
import {RadialSweepTracer} from './boundary-tracing/radial-sweep-tracer';
import {Mesh, MeshBuilder, Scene, Vector3, Vector4} from '@babylonjs/core';
import * as earcut from 'earcut';
import {SideMeshGenerator} from './side-mesh-generator';
import {adjustLevel, getLevelOffsetTile} from './offset-helper';
import {SimpleTileLayer} from './simple-tile-layer';
import Tile = Phaser.Tilemaps.Tile;

export class LayerMeshGenerator {
	
	public generateLevel(collLayer: CCMapLayer, aboveLayer: CCMapLayer | undefined, scene: Scene) {
		const map = Globals.map;
		if (!map) {
			throw new Error('map doesnt exist');
		}
		
		const phaserLayer = collLayer.getPhaserLayer();
		if (!phaserLayer) {
			throw new Error('phaser layer of collision layer does not exist');
		}
		
		const simpleTileLayer = new SimpleTileLayer();
		simpleTileLayer.initLayer(phaserLayer);
		
		if (collLayer.details.level < map.masterLevel) {
			this.transformToBelowMaster(simpleTileLayer, aboveLayer);
		}
		
		// extend bottom based on level;
		// let offset = getLevelOffsetTile(collLayer.details.level + 1) - getLevelOffsetTile(collLayer.details.level);
		const levelOffset = getLevelOffsetTile(adjustLevel(collLayer.details.level));
		const levelOffset2 = getLevelOffsetTile(adjustLevel(collLayer.details.level + 1));
		let offset = levelOffset2 - levelOffset;
		if (collLayer.details.level < Globals.map.masterLevel) {
			offset *= -1;
		}
		// console.log(`levelOffset: ${levelOffset} - levelOffset2: ${levelOffset2} - offset: ${offset}`);
		simpleTileLayer.extendBottom(offset);
		
		const tiles: Tile[] = simpleTileLayer.tiles.flat();
		
		const allTiles = new Set<Tile>();
		const validTiles = [2, 8, 9, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27];
		for (const tile of tiles) {
			if (validTiles.includes(tile.index)) {
				allTiles.add(tile);
			}
		}
		
		if (allTiles.size === 0) {
			console.warn('not generating mesh, collision layer is empty');
			return [];
		}
		
		const meshes: Mesh[] = [];
		
		let meshCounter = 0;
		
		while (allTiles.size > 0) {
			const toCheck: (Tile | null)[] = [allTiles.values().next().value];
			const group = new Set<Tile>();
			while (toCheck.length > 0) {
				const tile = toCheck.pop()!;
				if (allTiles.delete(tile)) {
					group.add(tile);
					toCheck.push(...this.getNeighbours(tile, simpleTileLayer));
				}
			}
			meshes.push(this.generateMesh('coll layer ' + collLayer.details.level + ' - ' + (++meshCounter), group, collLayer, simpleTileLayer, scene));
			// debug mesh
			// const ground = MeshBuilder.CreateGround('debug plane', {
			// 	width: collLayer.details.width,
			// 	height: collLayer.details.height
			// });
			// ground.position.y = 1;
			// meshes.push(ground);
		}
		
		return meshes;
	}
	
	// empty -> block, blue -> empty
	public transformToBelowMaster(layer: SimpleTileLayer, above?: CCMapLayer) {
		let tileOffset = 0;
		if (above) {
			tileOffset = getLevelOffsetTile(above.details.level);
			if (above.details.level === 0) {
				above = undefined;
			}
		}
		for (const row of layer.tiles) {
			for (const tile of row) {
				let aboveIndex = -1;
				if (above) {
					const aboveTile = above.getPhaserLayer()!.getTileAt(tile.x, tile.y + tileOffset);
					if (aboveTile) {
						aboveIndex = aboveTile.index;
					}
				}
				tile.index = reverseTileIndex(tile.index);
				if (tile.index === 2 && aboveIndex !== -1) {
					tile.index = reverseTileIndex(aboveIndex);
				}
				
				function reverseTileIndex(index: number) {
					switch (index) {
						// empty
						case 0:
							return 2;
						
						// ■
						case 1:
							return 0;
						
						// ◣
						case 4:
							return 10;
						
						// ◤
						case 5:
							return 11;
						
						// ◥
						case 6:
							return 8;
						
						// ◢
						case 7:
							return 9;
						
						default:
							return index;
					}
				}
			}
		}
	}
	
	private generateMesh(name: string, tiles: Set<Tile>, ccLayer: CCMapLayer, simpleTileLayer: SimpleTileLayer, scene: Scene) {
		const layer = ccLayer.getPhaserLayer()!;
		const tracer = new RadialSweepTracer();
		const tracerObj = tracer.getContour(tiles, simpleTileLayer);
		console.log('tracerOBJ', tracerObj);
		const path = tracerObj.path;
		
		let maxX = -9999;
		let minX = 9999;
		
		let maxY = -9999;
		let minY = 9999;
		for (const v of path) {
			minX = Math.min(minX, v.x);
			maxX = Math.max(maxX, v.x);
			
			minY = Math.min(minY, v.y);
			maxY = Math.max(maxY, v.y);
		}
		
		// minY = 0;
		const topWidth = (maxX - minX) / layer.tilemap.width;
		const topHeight = (maxY - minY) / layer.tilemap.height;
		
		const offsetX = minX / layer.tilemap.width;
		
		const level = ccLayer.details.level;
		let heightOffset = 0;
		// TODO: try to handle this case with adjustLevel function
		if (level + 1 >= Globals.map.masterLevel) {
			heightOffset = getLevelOffsetTile(adjustLevel(level + 1)) - getLevelOffsetTile(adjustLevel(level));
		} else {
			heightOffset = getLevelOffsetTile(adjustLevel(level + 2)) - getLevelOffsetTile(adjustLevel(level + 1));
		}
		
		let offsetY = (layer.tilemap.height - maxY + heightOffset) / layer.tilemap.height;
		
		// 1 px offset, no idea where that comes from
		offsetY -= 1 / layer.tilemap.heightInPixels;
		
		const pathArr = path.map(t => {
			return new Vector3(t.x, 0, -t.y);
		});
		
		const holes = tracerObj.holes.map(hole => {
			return hole.map(t => {
				return new Vector3(t.x, 0, -t.y);
			});
		});
		
		const top = MeshBuilder.CreatePolygon(name, {
			shape: pathArr,
			holes: holes,
			updatable: true,
			faceUV: [
				new Vector4(offsetX, offsetY, offsetX + topWidth, offsetY + topHeight),
				new Vector4(0, 0, 0, 0),
				new Vector4(0, 0, 0, 0)
			]
		}, scene, earcut);
		
		
		const sideMeshGenerator = new SideMeshGenerator();
		const mesh = sideMeshGenerator.generate(top, ccLayer, simpleTileLayer);
		
		const merge = Mesh.MergeMeshes([top, mesh])!;
		
		// merge.position.x = -layer.tilemap.width * 0.5;
		// merge.position.z = layer.tilemap.height * 0.5;
		
		const verticalOffset = getLevelOffsetTile((ccLayer.details.level) + 1);
		merge.position.y = verticalOffset;
		
		const horizontalOffset = getLevelOffsetTile(adjustLevel(ccLayer.details.level));
		
		merge.position.z -= horizontalOffset;
		
		return merge;
		// return top;
	}
	
	private getNeighbours(tile: Tile, layer: SimpleTileLayer) {
		const out: (Tile | null)[] = [
			layer.getTileAt(tile.x + 1, tile.y),
			layer.getTileAt(tile.x - 1, tile.y),
			layer.getTileAt(tile.x, tile.y + 1),
			layer.getTileAt(tile.x, tile.y - 1),
		];
		
		return out.filter(tile => tile);
	}
}
