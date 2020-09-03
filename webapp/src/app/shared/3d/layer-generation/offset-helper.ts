import {Globals} from '../../globals';

export function getLevelOffset(level: number) {
	const map = Globals.map;
	if (level >= map.levels.length) {
		let maxDiff = 80;
		if (map.levels.length > 1) {
			maxDiff = map.levels[map.levels.length - 1].height - map.levels[map.levels.length - 2].height;
		}
		return map.levels[map.levels.length - 1].height + maxDiff * (level - map.levels.length + 1);
	} else if (level < 0) {
		let minDiff = 80;
		if (map.levels.length > 1) {
			minDiff = map.levels[1].height - map.levels[0].height;
		}
		return map.levels[0].height + minDiff * level;
	}
	return map.levels[level].height;
}

export function getLevelOffsetTile(level: number) {
	return getLevelOffset(level) / Globals.TILE_SIZE;
}

// adjust level dependent on masterLevel. level < masterLevel => level+1
export function adjustLevel(level: number) {
	if (level < Globals.map.masterLevel) {
		return level += 1;
	}
	return level;
}
