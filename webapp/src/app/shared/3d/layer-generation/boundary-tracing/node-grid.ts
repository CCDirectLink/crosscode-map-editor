import Tile = Phaser.Tilemaps.Tile;
import { SimpleTileLayer } from '../simple-tile-layer';
import { BoundaryTracer } from './boundary-tracer';

export class NodeTracer implements BoundaryTracer {
	public getContour(layer: SimpleTileLayer): PolygonDescription[] {
		const grid = new NodeGrid(layer.width, layer.height);
		grid.findEdges(layer.tiles.flat());
		return grid.findPolygons();
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

		let poly = this.findPolygon(result);
		while (poly) {
			result.push(poly);
			poly = this.findPolygon(result);
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

	private findPolygon(found: PolygonDescription[]): PolygonDescription | null {
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

		let isHole = false;
		for (const poly of found) {
			if (poly.poly.contains(start.x, start.y)) {
				isHole = !isHole;
			}
		}

		let nodes = start.firstConnection.findRouteTo(start, start, isHole);
		if (!nodes) {
			throw new Error('Incomplete polygon');
		}

		if (this.isPathClockwise(nodes)) {
			nodes = nodes.reverse();
		}

		const p = new Phaser.Geom.Polygon(nodes as unknown as Phaser.Geom.Point[]);
		return { points: nodes, holes: [], poly: p, holePolys: [] };
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
		const conn1 = { x: next.x - node.x, y: next.y - node.y };
		const conn2 = { x: prev.x - node.x, y: prev.y - node.y };

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
		return this.rightNode(0)!;
	}

	public findRouteTo(node: Node, from: Node, hole: boolean): Node[] {
		const result: Node[] = [node];
		this.findRouteToGo(node, from, hole, result);
		return result;
	}

	private findRouteToGo(node: Node, from: Node, hole: boolean, result: Node[]): void {
		from.mark(this);

		if (node === this && node !== from) {

			return;
		}

		result.push(this);

		const fromDir = this.direction(from);
		const nextNode = hole ? this.rightNode(fromDir) : this.leftNode(fromDir);
		if (nextNode) {
			return nextNode.findRouteToGo(node, this, hole, result);
		}

		throw new Error('Incomplete polygon');
	}

	//Returns the next node in clockwise order.
	private rightNode(fromDir: number): Node | undefined {
		let maxNode: Node | undefined;
		let maxDirection = -1;

		for (const conn of this.connections) {
			if (!conn || this.isMarkedFrom(conn)) {
				continue;
			}

			let dir = (this.direction(conn) - fromDir) & 7; //&7 is the same as (... + 8) % 8
			if (dir > maxDirection) {
				maxNode = conn;
				maxDirection = dir;
			}
		}

		return maxNode;
	}

	//Returns the next node in counterclockwise order.
	private leftNode(fromDir: number): Node | undefined {
		let minNode: Node | undefined;
		let minDirection = 8;

		for (const conn of this.connections) {
			if (!conn || this.isMarkedFrom(conn)) {
				continue;
			}

			let dir = (this.direction(conn) - fromDir) & 7; //&7 is the same as (... + 8) % 8
			if (dir < minDirection) {
				minNode = conn;
				minDirection = dir;
			}
		}

		return minNode;
	}

	private direction(connection: Node | undefined): number {
		if (!connection) {
			return -1;
		}

		const dirX = connection.x - this.x;
		const dirY = connection.y - this.y;

		switch (dirY) {
			case -1:
				switch (dirX) {
					case -1:
						return 7;
					case 0:
						return 0;
					case 1:
						return 1;
				}
				break;
			case 0:
				switch (dirX) {
					case -1:
						return 6;
					case 1:
						return 2;
				}
				break;
			case 1:
				switch (dirX) {
					case -1:
						return 5;
					case 0:
						return 4;
					case 1:
						return 3;
				}
				break;
		}
		throw new Error('Invalid connection');
	}
}

export interface PolygonDescription {
	poly: Phaser.Geom.Polygon;
	points: Node[];
	holes: Node[][];
	holePolys: Phaser.Geom.Polygon[];
}
