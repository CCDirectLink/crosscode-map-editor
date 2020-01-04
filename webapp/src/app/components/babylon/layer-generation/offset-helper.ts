import {Globals} from '../../../shared/globals';

function getLevelOffset(level: number) {
	const map = Globals.map;
	return map.levels[level].height;
}

function getLevelOffsetTile(level: number) {
	const map = Globals.map;
	return map.levels[level].height / Globals.TILE_SIZE;
}

export {getLevelOffsetTile, getLevelOffset};
