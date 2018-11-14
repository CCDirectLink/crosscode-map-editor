// Vector tools (source: http://impactjs.com/forums/impact-engine/vector-math-helper-class/page/1)

import {Point} from '../../models/cross-code-map';

export class Vec2 {

	/**
	 * @inline
	 * @param otherVec
	 */
	public static create(otherVec) {
		const res = <Point>{};
		res.x = (otherVec && otherVec.x || 0);
		res.y = (otherVec && otherVec.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param x
	 * @param y
	 */
	public static createC(x, y) {
		const res = <Point>{};
		res.x = (x || 0);
		res.y = (y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static assign(v1, v2) {
		v1.x = (v2.x || 0);
		v1.y = (v2.y || 0);
		return v1;
	}

	/**
	 * @inline
	 * @param v
	 * @param x
	 * @param y
	 */
	public static assignC(v, x, y) {
		v.x = (x || 0);
		v.y = (y || 0);
		return v;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 * @param {boolean=} copy
	 */
	public static add(v1, v2, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) + (v2.x || 0);
		res.y = (v1.y || 0) + (v2.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param x
	 * @param y
	 * @param {boolean=} copy
	 */
	public static addC(v1, x, y, copy?) {
		const res = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) + (x || 0);
		res.y = (v1.y || 0) + (y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 * @param {boolean=} copy
	 */
	public static sub(v1, v2, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) - (v2.x || 0);
		res.y = (v1.y || 0) - (v2.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param x
	 * @param y
	 * @param {boolean=} copy
	 */
	public static subC(v1, x, y, copy?) {
		const res = copy ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) - (x || 0);
		res.y = (v1.y || 0) - (y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 * @param {boolean=} copy
	 */
	public static mul(v1, v2, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (v2.x || 0);
		res.y = (v1.y || 0) * (v2.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param x
	 * @param y
	 * @param {boolean=} copy
	 */
	public static mulC(v1, x, y, copy?) {
		const res = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) * (x || 0);
		res.y = (v1.y || 0) * (y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param f
	 * @param {boolean=} copy
	 */
	public static mulF(v1, f, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (f || 0);
		res.y = (v1.y || 0) * (f || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 * @param {boolean=} copy
	 */
	public static div(v1, v2, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) / (v2.x || 0);
		res.y = (v1.y || 0) / (v2.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param x
	 * @param y
	 * @param {boolean=} copy
	 */
	public static divC(v1, x, y?, copy?) {
		const res = copy || false ? {} : v1;
		y = y === undefined || y === null ? x : y;
		res.x = (v1.x || 0) / (x || 0);
		res.y = (v1.y || 0) / (y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static dot(v1, v2) {
		return (v1.x || 0) * (v2.x || 0) + (v1.y || 0) * (v2.y || 0);
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static dotR(v1, v2) {
		return -(v1.y || 0) * (v2.x || 0) + (v1.x || 0) * (v2.y || 0);
	}

	/**
	 * @inline
	 * @param v
	 * @param newLength
	 * @param {boolean=} copy
	 */
	public static vlength(v, newLength?, copy?) {
		const oldLength = Math.sqrt((v.x || 0) * (v.x || 0) + (v.y || 0) * (v.y || 0));
		if (newLength) {
			return Vec2.mulC(v, oldLength ? newLength / oldLength : 1, null, copy);
		} else {
			return oldLength;
		}
	}

	/**
	 * @inline
	 * @param v
	 * @param min
	 * @param max
	 * @param {boolean=} copy
	 */
	public static limit(v, min, max, copy?) {
		const length = Vec2.vlength(v);
		if (length > max) {
			return Vec2.mulC(v, max / length, null, copy);
		} else if (length < min) {
			return Vec2.mulC(v, min / length, null, copy);
		} else {
			return copy || false ? Vec2.create(v) : v;
		}
	}

	/**
	 * @inline
	 * @param v
	 * @param {boolean=} copy
	 */
	public static normalize(v, copy?) {
		return Vec2.vlength(v, 1, copy);
	}

	/**
	 * @inline
	 * @param v
	 */
	public static clockangle(v) {
		let result = Math.acos(-(v.y || 0) / Vec2.vlength(v));
		if (v.x < 0) {
			result = 2 * Math.PI - result;
		}
		return result || 0;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static angle(v1, v2) {
		const result = Math.acos(Vec2.dot(v1, v2) / ( Vec2.vlength(v1) * Vec2.vlength(v2) ));
		return result || 0;
	}

	/**
	 * @inline
	 * @param v
	 * @param angle
	 * @param {boolean=} copy
	 */
	public static rotate(v, angle, copy?) {
		const res = copy || false ? {} : v;
		const x = v.x || 0;
		res.x = Math.cos(angle) * x + Math.sin(angle) * (v.y || 0);
		res.y = Math.sin(-angle) * x + Math.cos(angle) * (v.y || 0);
		return res;
	}

	/**
	 * @inline
	 * @param v
	 * @param {boolean=} copy
	 */
	public static rotate90CW(v, copy?) {
		const res = copy || false ? {} : v;
		const x = (v.x || 0);
		res.x = (v.y || 0);
		res.y = -x;
		return res;
	}

	/**
	 * @inline
	 * @param v
	 * @param {boolean=} copy
	 */
	public static rotate90CCW(v, copy?) {
		const res = copy || false ? {} : v;
		const x = (v.x || 0);
		res.x = -(v.y || 0);
		res.y = x;
		return res;
	}

	/**
	 * @inline
	 * @param v
	 * @param {boolean=} copy
	 */
	public static flip(v, copy?) {
		const res = copy || false ? {} : v;
		res.x = -v.x;
		res.y = -v.y;
		return res;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static equal(v1, v2) {
		return v1.x === v2.x && v1.y === v2.y;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static distance(v1, v2) {
		const x = ((v1.x - v2.x) || 0);
		const y = ((v1.y - v2.y) || 0);
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 */
	public static distance2(v1, v2) {
		const x = ((v1.x - v2.x) || 0);
		const y = ((v1.y - v2.y) || 0);
		return x * x + y * y;
	}

	/**
	 * @inline
	 * @param v1
	 * @param v2
	 * @param i
	 * @param {boolean=} copy
	 */
	public static lerp(v1, v2, i, copy?) {
		const res = copy || false ? {} : v1;
		res.x = (v1.x || 0) * (1 - i) + (v2.x || 0) * i;
		res.y = (v1.y || 0) * (1 - i) + (v2.y || 0) * i;
		return res;
	}
}
