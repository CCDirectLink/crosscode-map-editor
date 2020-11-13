import { Point } from '../../../models/cross-code-map';

// Bresenham's line algorithm
export function pointsInLine(start: Point, end: Point): Point[] {
	let x0 = start.x;
	let y0 = start.y;
	const x1 = end.x;
	const y1 = end.y;
	
	const out = [];
	
	const dx = Math.abs(x1 - x0);
	const sx = x0 < x1 ? 1 : -1;
	const dy = -Math.abs(y1 - y0);
	const sy = y0 < y1 ? 1 : -1;
	let err = dx + dy;
	while (true) {
		out.push({x: x0, y: y0});
		if (x0 === x1 && y0 === y1) {
			break;
		}
		const e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			x0 += sx;
		}
		if (e2 <= dx) {
			err += dx;
			y0 += sy;
		}
	}
	
	return out;
}
