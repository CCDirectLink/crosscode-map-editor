// Vector tools (source: http://impactjs.com/forums/impact-engine/vector-math-helper-class/page/1)

import { Point } from '../../models/cross-code-map';

export class Vec2 {
	public static create(otherVec?: Point) {
		const res = {} as Point;
		res.x = (otherVec && otherVec.x) || 0;
		res.y = (otherVec && otherVec.y) || 0;
		return res;
	}

	public static createC(x?: number, y?: number) {
		const res = {} as Point;
		res.x = x || 0;
		res.y = y || 0;
		return res;
	}

	public static assign(v1: Point, v2: Point) {
		v1.x = v2.x || 0;
		v1.y = v2.y || 0;
		return v1;
	}

	public static assignC(v: Point, x?: number, y?: number) {
		v.x = x || 0;
		v.y = y || 0;
		return v;
	}

	public static add(v1: Point, v2: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) + (v2.x || 0);
		res.y = (v1.y || 0) + (v2.y || 0);
		return res;
	}

	public static addC(v1: Point, x?: number, y?: number, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) + (x || 0);
		res.y = (v1.y || 0) + (y || 0);
		return res;
	}

	public static sub(v1: Point, v2: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) - (v2.x || 0);
		res.y = (v1.y || 0) - (v2.y || 0);
		return res;
	}

	public static subC(v1: Point, x: number, y: number, copy?: boolean) {
		const res: any = copy ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) - (x || 0);
		res.y = (v1.y || 0) - (y || 0);
		return res;
	}

	public static mul(v1: Point, v2: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (v2.x || 0);
		res.y = (v1.y || 0) * (v2.y || 0);
		return res;
	}

	public static mulC(v1: Point, x?: number, y?: number, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) * (x || 0);
		res.y = (v1.y || 0) * (y || 0);
		return res;
	}

	public static mulF(v1: Point, f: number, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (f || 0);
		res.y = (v1.y || 0) * (f || 0);
		return res;
	}

	public static div(v1: Point, v2: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) / (v2.x || 0);
		res.y = (v1.y || 0) / (v2.y || 0);
		return res;
	}

	public static divC(v1: Point, x?: number, y?: number, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) / (x || 0);
		res.y = (v1.y || 0) / (y || 0);
		return res;
	}

	public static dot(v1: Point, v2: Point) {
		return (v1.x || 0) * (v2.x || 0) + (v1.y || 0) * (v2.y || 0);
	}

	public static dotR(v1: Point, v2: Point) {
		return -(v1.y || 0) * (v2.x || 0) + (v1.x || 0) * (v2.y || 0);
	}

	public static vlength(v: Point, newLength?: number, copy?: boolean) {
		const oldLength = Math.sqrt(
			(v.x || 0) * (v.x || 0) + (v.y || 0) * (v.y || 0),
		);
		if (newLength) {
			return Vec2.mulC(
				v,
				oldLength ? newLength / oldLength : 1,
				undefined,
				copy,
			);
		} else {
			return oldLength;
		}
	}

	public static limit(v: Point, min: number, max: number, copy?: boolean) {
		const length = Vec2.vlength(v);
		if (length > max) {
			return Vec2.mulC(v, max / length, undefined, copy);
		} else if (length < min) {
			return Vec2.mulC(v, min / length, undefined, copy);
		} else {
			return copy || false ? Vec2.create(v) : v;
		}
	}

	public static normalize(v: Point, copy?: boolean) {
		return Vec2.vlength(v, 1, copy);
	}

	public static clockangle(v: Point) {
		let result = Math.acos(-(v.y || 0) / Vec2.vlength(v));
		if (v.x < 0) {
			result = 2 * Math.PI - result;
		}
		return result || 0;
	}

	public static angle(v1: Point, v2: Point) {
		const result = Math.acos(
			Vec2.dot(v1, v2) / (Vec2.vlength(v1) * Vec2.vlength(v2)),
		);
		return result || 0;
	}

	public static rotate(v: Point, angle: number, copy?: boolean) {
		const res: any = copy || false ? {} : v;
		const x = v.x || 0;
		res.x = Math.cos(angle) * x + Math.sin(angle) * (v.y || 0);
		res.y = Math.sin(-angle) * x + Math.cos(angle) * (v.y || 0);
		return res;
	}

	public static rotate90CW(v: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v;
		const x = v.x || 0;
		res.x = v.y || 0;
		res.y = -x;
		return res;
	}

	public static rotate90CCW(v: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v;
		const x = v.x || 0;
		res.x = -(v.y || 0);
		res.y = x;
		return res;
	}

	public static flip(v: Point, copy?: boolean) {
		const res: any = copy || false ? {} : v;
		res.x = -v.x;
		res.y = -v.y;
		return res;
	}

	public static equal(v1: Point, v2: Point) {
		return v1.x === v2.x && v1.y === v2.y;
	}

	public static distance(v1: Point, v2: Point) {
		const x = v1.x - v2.x || 0;
		const y = v1.y - v2.y || 0;
		return Math.sqrt(x * x + y * y);
	}

	public static distance2(v1: Point, v2: Point) {
		const x = v1.x - v2.x || 0;
		const y = v1.y - v2.y || 0;
		return x * x + y * y;
	}

	public static lerp(v1: Point, v2: Point, i: number, copy?: boolean) {
		const res: any = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (1 - i) + (v2.x || 0) * i;
		res.y = (v1.y || 0) * (1 - i) + (v2.y || 0) * i;
		return res;
	}
}
