import { Anims, flattenSUBs } from '../../sheet-parser';

// Unit face vectors. Mirrors CC's FACE8.
export const FACE_VECTORS: Record<string, { x: number; y: number }> = {
	NORTH: { x: 0, y: -1 },
	NORTH_EAST: { x: 1, y: -1 },
	EAST: { x: 1, y: 0 },
	SOUTH_EAST: { x: 1, y: 1 },
	SOUTH: { x: 0, y: 1 },
	SOUTH_WEST: { x: -1, y: 1 },
	WEST: { x: -1, y: 0 },
	NORTH_WEST: { x: -1, y: -1 },
};

// Port of ig.getDirectionIndex — picks a tileOffsets slot from a face vector + dir count.
export function getDirectionIndex(faceX: number, faceY: number, numDirs: number): number {
	switch (numDirs) {
		case 1:
			return 0;
		case 2:
			return faceX >= 0 ? 0 : 1;
		case 4:
			return Math.abs(faceY) > Math.abs(faceX)
				? (faceY < 0 ? 0 : 2)
				: (faceX > 0 ? 1 : 3);
		case 6:
			return faceX >= 0
				? (faceY <= 0
					? 0 + (57 * faceX > -100 * faceY ? 1 : 0)
					: 1 + (57 * faceX < 100 * faceY ? 1 : 0))
				: (faceY <= 0
					? 4 + (-57 * faceX < -100 * faceY ? 1 : 0)
					: 3 + (-57 * faceX > 100 * faceY ? 1 : 0));
		case 8:
			return Math.abs(faceY) > 2.414 * Math.abs(faceX)
				? (faceY < 0 ? 0 : 4)
				: Math.abs(faceX) > 2.414 * Math.abs(faceY)
					? (faceX > 0 ? 2 : 6)
					: (faceX > 0 ? (faceY < 0 ? 1 : 3) : (faceY > 0 ? 5 : 7));
		default:
			return Math.floor(numDirs / 2);
	}
}

export function resolveDirIndex(anims: Anims, face: string | undefined, animName?: string): number | undefined {
	const vec = face ? FACE_VECTORS[face] : undefined;
	if (!vec) {
		return undefined;
	}
	const leaves = flattenSUBs(anims, {});
	const hasDirs = (leaf: Anims) => Array.isArray(leaf.tileOffsets) && leaf.tileOffsets.length > 0;
	const leaf = (animName ? leaves.find(l => l.name === animName) : undefined) ?? leaves.find(hasDirs) ?? leaves[0];
	if (!leaf) {
		return undefined;
	}
	let numDirs = typeof leaf.dirs === 'string' ? parseInt(leaf.dirs, 10) : leaf.dirs;
	if (!numDirs && Array.isArray(leaf.tileOffsets)) {
		numDirs = leaf.tileOffsets.length;
	}
	if (!numDirs) {
		return undefined;
	}
	return getDirectionIndex(vec.x, vec.y, numDirs);
}
