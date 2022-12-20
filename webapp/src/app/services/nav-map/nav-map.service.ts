import { Injectable } from '@angular/core';
import { CCMapLayer } from '../phaser/tilemap/cc-map-layer';
import { SimpleTileLayer } from '../3d/layer-generation/simple-tile-layer';
import { Globals } from '../globals';
import { EventManager } from '@angular/platform-browser';
import { Helper } from '../phaser/helper';
import { MapLoaderService } from '../map-loader.service';
import { GlobalEventsService } from '../global-events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeGrid } from '../3d/layer-generation/boundary-tracing/node-grid';
import { Point } from '../../models/cross-code-map';
import { makeCCW, Polygon, quickDecomp } from 'poly-decomp-es';
import Tile = Phaser.Tilemaps.Tile;
import { StateHistoryService } from '../../components/dialogs/floating-window/history/state-history.service';

enum PolygonFillStep {
	rect = 1,
	right = 2,
	down = 3,
	left = 4,
	up = 5,
	done = 6
}

@Injectable({
	providedIn: 'root',
})
export class NavMapService {
	
	private graphics?: Phaser.GameObjects.Graphics;
	private debugScale = 16;
	
	constructor(
		private snackbar: MatSnackBar,
		private events: GlobalEventsService,
		private stateHistory: StateHistoryService,
		mapLoader: MapLoaderService,
		eventManager: EventManager,
	) {
		eventManager.addEventListener(document as any, 'keydown', (event: KeyboardEvent) => {
			if (Helper.isInputFocused()) {
				return;
			}
			if (event.ctrlKey && event.key.toLowerCase() === 'm') {
				event.preventDefault();
				this.generateNavMap(mapLoader.selectedLayer.value);
			}
		});
	}
	
	public init() {
		this.events.generateNavMap.subscribe(layer => this.generateNavMap(layer));
	}
	
	async generateNavMap(navLayer?: CCMapLayer) {
		if (!navLayer || navLayer.details.type !== 'Navigation') {
			this.snackbar.open('Navigation Layer needs to be selected', 'ok');
			return;
		}
		
		const collLayer = Globals.map.layers.find(l => l.details.level === navLayer.details.level && l.details.type === 'Collision');
		if (!collLayer) {
			this.snackbar.open('No Collision Layer found on same level as Navigation Layer', 'ok');
			return;
		}
		
		const graphics = this.initGraphics();
		
		const data = this.inverseCollMap(collLayer.exportLayer().data);
		
		const coll = new SimpleTileLayer();
		coll.initSimple(data);
		
		const nav = new SimpleTileLayer();
		nav.initSimple(navLayer.exportLayer().data.map(v => v.map(n => 0)));
		
		
		for (let i = 0; i < 1000; i++) {
			graphics.clear();
			
			let hasColls = false;
			for (const line of coll.tiles) {
				for (const v of line) {
					if (v.index === 2) {
						hasColls = true;
						break;
					}
				}
			}
			if (!hasColls) {
				break;
			}
			
			
			const grid = new NodeGrid(coll.width, coll.height);
			grid.findEdges(coll.tiles.flat());
			const polygons = grid.findPolygons();
			
			
			const newPolygons: { poly: Polygon, size: number }[] = [];
			
			for (const polygon of polygons) {
				const points: [number, number][] = polygon.points.map(v => [v.x, v.y]);
				makeCCW(points);
				const convexPolygons = quickDecomp(points)!;
				for (const polygon of convexPolygons) {
					newPolygons.push({
						poly: polygon,
						size: this.polygonSize(polygon)
					});
				}
			}
			
			newPolygons.sort((a, b) => b.size - a.size);
			
			if (newPolygons.length === 0) {
				console.error('newPolygons === 0, should never happen');
				break;
			}
			const bestTile: Point = {x: -1, y: -1};
			let bestPoly: Polygon | undefined;
			for (const polygon of newPolygons) {
				const center = this.polygonCenter(polygon.poly);
				const x = Math.floor(center.x);
				const y = Math.floor(center.y);
				
				const tile = coll.getTileAt(x, y);
				const navTile = nav.getTileAt(x, y);
				if (tile?.index === 2 && navTile?.index === 0) {
					bestTile.x = x;
					bestTile.y = y;
					bestPoly = polygon.poly;
					break;
				}
			}
			if (bestTile.x === -1 || !bestPoly) {
				console.warn('no valid center point found, algorithm finished');
				break;
			}
			
			// this.debugDecompPolygons(newPolygons.map(v => v.poly));
			// this.debugPoint(bestTile, true);
			
			this.fillPolygon(bestTile, bestPoly, nav, coll, navLayer);
			
			// collLayer!.getPhaserLayer().putTilesAt(coll.tiles, 0, 0, false);
			// navLayer!.getPhaserLayer().putTilesAt(nav.tiles, 0, 0, false);
		}
		
		// collLayer!.getPhaserLayer().putTilesAt(coll.tiles, 0, 0, false);
		navLayer!.getPhaserLayer().putTilesAt(nav.tiles, 0, 0, false);
		
		this.stateHistory.saveState({
			name: 'Nav Map Generation',
			icon: 'navigation'
		});
	}
	
	private initGraphics() {
		if (this.graphics) {
			return this.graphics;
		}
		this.graphics = Globals.scene.add.graphics();
		this.graphics.setDepth(999);
		return this.graphics;
	}
	
	private inverseCollMap(data: number[][]) {
		return data.map(v => v.map(i => {
			switch (i) {
			case 0:
				return 2;
			
			case 8:
				return 10;
			case 9:
				return 11;
			case 10:
				return 8;
			case 11:
				return 9;
			
			case 20:
				return 22;
			case 21:
				return 23;
			case 22:
				return 20;
			case 23:
				return 21;
			
			case 24:
				return 26;
			case 25:
				return 27;
			case 26:
				return 24;
			case 27:
				return 25;
			
			default:
				return 0;
			}
		}));
	}
	
	private polygonSize(polygon: Polygon) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		
		for (const p of polygon) {
			if (p[0] < minX) {
				minX = p[0];
			}
			if (p[1] < minY) {
				minY = p[1];
			}
			
			if (p[0] > maxX) {
				maxX = p[0];
			}
			if (p[1] > maxY) {
				maxY = p[1];
			}
		}
		
		return (maxX - minX) * (maxY - minY);
	}
	
	private polygonCenter(polygon: Polygon): Point {
		const center: Point = {x: 0, y: 0};
		let weight = 0;
		const size = polygon.length;
		for (let i = 0; i < size; i++) {
			const point = polygon[i];
			const prev = polygon[(i - 1 + size) % size];
			const next = polygon[(i + 1) % size];
			
			const len = Math.sqrt(Math.abs(point[0] - prev[0]) ** 2 + Math.abs(point[1] - prev[1]) ** 2) +
				Math.sqrt(Math.abs(point[0] - next[0]) ** 2 + Math.abs(point[1] - next[1]) ** 2);
			center.x += point[0] * len;
			center.y += point[1] * len;
			weight += len;
			
		}
		return {
			x: center.x / weight,
			y: center.y / weight
		};
	}
	
	private fillPolygon(start: Point, polygon: Polygon, nav: SimpleTileLayer, coll: SimpleTileLayer, navLayer: CCMapLayer) {
		// TODO: decide if rectangle fill or polygon fill
		
		// rectangle fill
		let openList: Tile[] = [nav.getTileAt(start.x, start.y)!];
		const closedList = new Set<Tile>();
		nav.setTileAt(-1, start.x, start.y);
		
		let fillStep: PolygonFillStep = PolygonFillStep.rect;
		
		for (let i = 1; i < 200; i++) {
			const neighbours = new Set<Tile>();
			let maxX = -Infinity;
			let maxY = -Infinity;
			let minX = Infinity;
			let minY = Infinity;
			for (const v of openList) {
				closedList.add(v);
				maxX = Math.max(maxX, v.x);
				maxY = Math.max(maxY, v.y);
				minX = Math.min(minX, v.x);
				minY = Math.min(minY, v.y);
				for (const n of getNeighbours(v, fillStep)) {
					neighbours.add(n);
				}
			}
			const dx = maxX - minX + 1;
			const dy = maxY - minY + 1;
			let condition = false;
			
			switch (fillStep) {
			case PolygonFillStep.rect:
				condition = neighbours.size === (i * 8);
				break;
			case PolygonFillStep.left:
			case PolygonFillStep.right:
				condition = neighbours.size === dy;
				break;
			case PolygonFillStep.down:
			case PolygonFillStep.up:
				condition = neighbours.size === dx;
				break;
			}
			
			if (condition) {
				// neighbours valid, continue filling
				const neighboursArr = Array.from(neighbours);
				for (const tile of neighboursArr) {
					tile.index = -1;
					coll.setTileAt(0, tile.x, tile.y);
				}
				openList = neighboursArr;
			} else {
				fillStep++;
				openList = Array.from(closedList);
				if (fillStep === PolygonFillStep.done) {
					break;
				}
			}
			
		}
		
		
		const indexes = new Set<number>();
		
		for (const v of openList) {
			for (const n of getNeighbours(v, PolygonFillStep.rect, true)) {
				indexes.add(n.index);
			}
		}
		
		// I don't like these colors
		// indexes.add(2);
		// indexes.add(4);
		// indexes.add(6);
		
		const indexArr = Array.from(indexes).filter(v => v >= 0);
		indexArr.sort();
		let index = -1;
		for (let i = 1; i < 9; i++) {
			if (i !== indexArr[i]) {
				index = i;
				break;
			}
		}
		
		for (const line of nav.tiles) {
			for (const tile of line) {
				if (tile.index === -1) {
					tile.index = index;
				}
			}
		}
		
		function getNeighbours(tile: Tile, fillStep: PolygonFillStep, ignoreValid?: boolean): Tile[] {
			switch (fillStep) {
			case PolygonFillStep.rect:
				return [
					...getValidTile(tile.x + 1, tile.y, ignoreValid),
					...getValidTile(tile.x - 1, tile.y, ignoreValid),
					...getValidTile(tile.x, tile.y + 1, ignoreValid),
					...getValidTile(tile.x, tile.y - 1, ignoreValid),
					
					...getValidTile(tile.x + 1, tile.y + 1, ignoreValid),
					...getValidTile(tile.x - 1, tile.y + 1, ignoreValid),
					...getValidTile(tile.x + 1, tile.y - 1, ignoreValid),
					...getValidTile(tile.x - 1, tile.y - 1, ignoreValid),
				];
			case PolygonFillStep.right:
				return [...getValidTile(tile.x + 1, tile.y)];
			case PolygonFillStep.left:
				return [...getValidTile(tile.x - 1, tile.y)];
			case PolygonFillStep.down:
				return [...getValidTile(tile.x, tile.y + 1)];
			case PolygonFillStep.up:
				return [...getValidTile(tile.x, tile.y - 1)];
			}
			return [];
			
			
			function getValidTile(x: number, y: number, ignoreValid?: boolean): Tile[] {
				const navTile = nav.getTileAt(x, y);
				const collTile = coll.getTileAt(x, y);
				if (ignoreValid) {
					return [navTile ?? {x: x, y: y, index: 0} as Tile];
				}
				if (navTile?.index === 0 && collTile?.index === 2) {
					return [navTile];
				}
				return [];
			}
		}
	}
	
	private debugPolygons(polygons: { points: Point[] }[]) {
		const graphics = this.graphics!;
		
		const colors = [
			0x49ede6,
			0x49aced,
			0x4957ed,
			0x9549ed,
			0xd449ed,
			0xed4949,
			0xed9849,
			0xe4ed49,
			0x8aed49,
			0x49ed81,
		];
		
		for (let i = 0; i < polygons.length; i++) {
			const col = colors[i % colors.length];
			const col2 = colors[(i + 2) % colors.length];
			const polygon = polygons[i];
			graphics.lineStyle(1, col, 0.4);
			graphics.fillStyle(col2, 0.4);
			graphics.beginPath();
			const allPoints = polygon.points.map(v => ({x: v.x * this.debugScale, y: v.y * this.debugScale}));
			const p1 = allPoints[0];
			const points = allPoints.slice(1);
			graphics.moveTo(p1.x, p1.y);
			for (const p of points) {
				graphics.lineTo(p.x, p.y);
			}
			graphics.closePath();
			graphics.strokePath();
			graphics.fillPath();
		}
	}
	
	private debugDecompPolygons(polygons: Polygon[]) {
		return this.debugPolygons(polygons.map(v => ({
			points: v.map(point => ({x: point[0], y: point[1]})),
		})));
	}
	
	private debugPoint(p: Point, big = false) {
		const scale = 0.13;
		const graphics = this.graphics!;
		graphics.lineStyle(0.5, 0x000000, 0.4);
		graphics.fillStyle(0x444444, 0.8);
		graphics.fillCircle(p.x * this.debugScale, p.y * this.debugScale, this.debugScale * scale);
		graphics.strokeCircle(p.x * this.debugScale, p.y * this.debugScale, this.debugScale * scale);
		if (big) {
			graphics.lineStyle(1.5, 0x000000, 0.8);
			graphics.beginPath();
			graphics.moveTo((p.x - 1) * this.debugScale, p.y * this.debugScale);
			graphics.lineTo((p.x + 1) * this.debugScale, p.y * this.debugScale);
			graphics.moveTo(p.x * this.debugScale, (p.y - 1) * this.debugScale);
			graphics.lineTo(p.x * this.debugScale, (p.y + 1) * this.debugScale);
			graphics.strokePath();
		}
	}
	
}
