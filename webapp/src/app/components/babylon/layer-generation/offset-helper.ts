import {Globals} from '../../../shared/globals';

function getLevelOffset(level: number) {
	const map = Globals.map;
	if (level >= map.levels.length) {
		return map.levels[map.levels.length - 1].height + 64;
	} else if (level < 0) {
		return map.levels[0].height + 64 * level;
	}
	return map.levels[level].height;
}

function getLevelOffsetTile(level: number) {
	return getLevelOffset(level) / Globals.TILE_SIZE;
}

export {getLevelOffsetTile, getLevelOffset};
