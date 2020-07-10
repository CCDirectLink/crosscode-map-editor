import {Globals} from '../../../shared/globals';
import {CCMapLayer} from '../../../shared/phaser/tilemap/cc-map-layer';
import {Mesh, MeshBuilder, Scene, Vector3, Vector4} from '@babylonjs/core';
import * as earcut from 'earcut';
import {SideMeshGenerator} from './side-mesh-generator';
import {adjustLevel, getLevelOffsetTile} from './offset-helper';
import {SimpleTileLayer} from './simple-tile-layer';
import {NodeGrid, PolygonDescription} from './boundary-tracing/node-grid';
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
		
		const meshes: Mesh[] = [];
		
		let meshCounter = 0;
		
		const grid = new NodeGrid(simpleTileLayer.width, simpleTileLayer.height);
		grid.findEdges(tiles);
		const polygons = grid.findPolygons();
		for (const polygon of polygons) {
			meshes.push(this.generateMesh('coll layer ' + collLayer.details.level + ' - ' + (++meshCounter), polygon, collLayer, simpleTileLayer, scene));
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
				if (tile.index === 2 && [1, 4, 5, 6, 7].includes(aboveIndex)) {
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
	
	private generateMesh(name: string, polygon: PolygonDescription, ccLayer: CCMapLayer, simpleTileLayer: SimpleTileLayer, scene: Scene, ) {
		const layer = ccLayer.getPhaserLayer()!;
		const path = polygon.points;
		
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
		
		const holes = polygon.holes.map(hole => {
			return hole.map(t => {
				return new Vector3(t.x, 0, -t.y);
			});
		});
		
		const top = MeshBuilder.CreatePolygon(name, {
			shape: pathArr,
			holes: holes,
			updatable: false,
			faceUV: [
				new Vector4(offsetX, offsetY, offsetX + topWidth, offsetY + topHeight),
				new Vector4(0, 0, 0, 0),
				new Vector4(0, 0, 0, 0)
			]
		}, scene, earcut);
		
		
		const sideMeshGenerator = new SideMeshGenerator();
		const mesh = sideMeshGenerator.generate(top, ccLayer, simpleTileLayer);
		
		const merge = Mesh.MergeMeshes([top, mesh])!;
		// const merge = Mesh.MergeMeshes([top])!;
		
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
