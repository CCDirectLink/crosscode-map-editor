import Tile = Phaser.Tilemaps.Tile;
import {Point} from '../../../../models/cross-code-map';
import {BoundaryTracer} from './boundary-tracer';
import {SimpleTileLayer} from '../simple-tile-layer';

export class NodeTracer implements BoundaryTracer {
	public getContour(tiles: Set<Tile>, layer: SimpleTileLayer): { path: Point[]; holes: Point[][]; } {
		const grid = new NodeGrid(layer.width, layer.height);
		grid.findEdges(layer.tiles.flat());
		const result = grid.findPolygons();
		if (result.length === 0) {
			return {path: [], holes: []};
		}
		
		return {
			path: result[0].points.map(p => ({x: p.x, y: p.y})),
			holes: result[0].holes.map(h => h.map(p => ({x: p.x, y: p.y})))
		};
	}
}

export class NodeGrid {
	private readonly nodes: Node[];
	private readonly width: number;
	
	public constructor(width: number, height: number) {
		this.width = width + 1;
		this.nodes = new Array((width + 1) * (height + 1));
		for (let y = 0; y < height + 1; y++) {
			for (let x = 0; x < width + 1; x++) {
				this.nodes[y * this.width + x] = new Node(x, y);
			}
		}
	}
	
	public get(x: number, y: number): Node {
		return this.nodes[y * this.width + x];
	}
	
	public findEdges(collTiles: Tile[]) {
		for (const tile of collTiles) {
			const n11 = this.get(tile.x, tile.y);
			const n12 = this.get(tile.x + 1, tile.y);
			const n21 = this.get(tile.x, tile.y + 1);
			const n22 = this.get(tile.x + 1, tile.y + 1);
			this.connect(tile.index, n11, n12, n21, n22);
		}
	}
	
	public findPolygons(): PolygonDescription[] {
		const result: PolygonDescription[] = [];
		
		let poly = this.findPolygon();
		while (poly) {
			result.push(poly);
			poly = this.findPolygon();
		}
		
		// Find polygon in polygon and make them holes.
		for (let i = 0; i < result.length; i++) {
			const desc = result[i];
			const poly = desc.poly;
			const subPolys = desc.holePolys;
			for (let j = i + 1; j < result.length; j++) {
				const sub = result[j];
				const node = sub.points[0];
				if (poly.contains(node.x, node.y) && subPolys.every(p => !p.contains(node.x, node.y))) {
					desc.holes.push(sub.points);
					desc.holePolys.push(sub.poly);
					result.splice(j, 1);
					j--;
				}
			}
		}
		
		return result;
	}
	
	private findPolygon(): PolygonDescription | null {
		let start: Node | undefined;
		for (const node of this.nodes) {
			if (node.hasConnections) {
				start = node;
				break;
			}
		}
		if (!start) {
			return null;
		}
		
		let nodes = start.firstConnection.findRouteTo(start, start);
		if (!nodes) {
			throw new Error('Incomplete polygon');
		}
		
		if (this.isPathClockwise(nodes)) {
			nodes = nodes.reverse();
		}
		
		nodes[0].resetCost();
		
		const p = new Phaser.Geom.Polygon(nodes as unknown as Phaser.Geom.Point[]);
		return {points: nodes, holes: [], poly: p, holePolys: []};
	}
	
	private connect(index: number, n11: Node, n12: Node, n21: Node, n22: Node): void {
		switch (index) {
			case 0:
				return;
			case 2: // ■
				n11.connectTo(n21); //Left
				n12.connectTo(n22); //Right
				n11.connectTo(n12); //Top
				n21.connectTo(n22); //Bottom
				return;
			case 8: // ◣
			case 20:
			case 24:
				n11.connectTo(n21); //Left
				n21.connectTo(n22); //Bottom
				n11.connectTo(n22); //Top -> bottom
				return;
			case 9: // ◤
			case 21:
			case 25:
				n11.connectTo(n21); //Left
				n11.connectTo(n12); //Top
				n21.connectTo(n12); //Bottom -> top
				return;
			case 10: // ◥
			case 22:
			case 26:
				n12.connectTo(n22); //Right
				n11.connectTo(n12); //Top
				n11.connectTo(n22); //Top -> bottom
				return;
			case 11: // ◢
			case 23:
			case 27:
				n12.connectTo(n22); //Right
				n21.connectTo(n22); //Bottom
				n21.connectTo(n12); //Bottom -> top
				return;
			default:
				return;
			//throw new Error('Unknown collision tile: ' + index);
		}
	}
	
	private isPathClockwise(nodes: Node[]): boolean {
		return this.isClockwise(nodes[0], nodes[1], nodes[nodes.length - 1]);
	}
	
	private isClockwise(node: Node, next: Node, prev: Node): boolean {
		const conn1 = {x: next.x - node.x, y: next.y - node.y};
		const conn2 = {x: prev.x - node.x, y: prev.y - node.y};
		
		return (conn1.x === conn2.x && conn1.y > conn2.y) // ◥
			|| (conn1.x > conn2.x); // ■, ◣, ◤, ◢
	}
}

export class Node {
	public readonly x: number;
	public readonly y: number;
	
	private readonly connections: (Node | undefined)[] = new Array(8);
	private readonly markedFrom: (Node | undefined)[] = new Array(8);
	
	private nextConnection = 0;
	private nextMarked = 0;
	
	private cost = -1;
	private costFrom!: Node;
	
	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Connects to another node or disconnects if the connection already exists.
	 * @param node
	 */
	public connectTo(node: Node): void {
		const connIndex = this.connections.indexOf(node);
		if (connIndex >= 0) {
			this.connections[connIndex] = undefined as unknown as Node;
			node.connections[node.connections.indexOf(this)] = undefined as unknown as Node;
		} else {
			this.connections[this.nextConnection] = node;
			node.connections[node.nextConnection] = this;
			
			this.nextConnection++;
			node.nextConnection++;
		}
	}
	
	public resetCost(): void {
		if (this.cost === -1) {
			return;
		}
		
		this.cost = -1;
		this.costFrom = undefined as unknown as Node;
		
		for (const node of this.connections) {
			if (node) {
				node.resetCost();
			}
		}
	}
	
	public mark(from: Node): void {
		this.markedFrom[this.nextMarked] = from;
		from.markedFrom[from.nextMarked] = this;
		
		this.nextMarked++;
		from.nextMarked++;
	}
	
	public isMarkedFrom(from: Node): boolean {
		return from && this.markedFrom.includes(from);
	}
	
	public get hasConnections(): boolean {
		return this.connections.filter(c => c && !this.isMarkedFrom(c)).length > 0;
	}
	
	public get firstConnection(): Node {
		return this.connections.find(c => c && !this.isMarkedFrom(c))!;
	}
	
	public findRouteTo(node: Node, from: Node): Node[] | null {
		if (node === this) {
			if (this.connections.every(c => !c || c.cost !== -1 || c.isMarkedFrom(this))) {
				const result: Node[] = [node];
				node.mark(from);
				while (from !== node) {
					result.push(from);
					from.mark(from.costFrom);
					from = from.costFrom;
				}
				return result;
			} else {
				return null;
			}
		}
		
		const newCost = from.cost + 1;
		if (this.cost <= newCost && this.cost !== -1) { //There is already a better path
			return null;
		}
		
		this.cost = newCost;
		this.costFrom = from;
		
		for (const connection of this.connections) {
			if (!connection || this.isMarkedFrom(connection) || connection === from) {
				continue;
			}
			
			const result = connection.findRouteTo(node, this);
			if (result) {
				return result;
			}
		}
		return null;
	}
}

export interface PolygonDescription {
	poly: Phaser.Geom.Polygon;
	points: Node[];
	holes: Node[][];
	holePolys: Phaser.Geom.Polygon[];
}
