import {Point} from '../../../models/cross-code-map';

const largeNum = 100000;

export function p2Hash(x: number, y: number) {
	return x * largeNum + y;
}

export function p2HashReverse(hash: number): Point {
	const y = hash % largeNum;
	const x = Math.floor(hash / largeNum);
	return {x, y};
}
