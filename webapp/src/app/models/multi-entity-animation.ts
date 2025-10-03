import { Point3 } from './cross-code-map';
import { TileSheet } from './tile-sheet';

export interface MultiEntityAnimation {
	DOCTYPE: 'MULTI_ENTITY_ANIMATION';

	anims: Record<string, EntityAnim>;
	baseSize: Point3;
	namedSheets?: Record<string, TileSheet>;
	parts: Record<string, Part>;
}

interface EntityAnim {
	time: number;
	frameCount: number;
	repeat: boolean;
	partAnims: Record<string, PartAnim>;
}

interface PartAnim {
	anim: string;
	posFrames: number[];
	reset: boolean;
	collType?: COLLTYPE;
}

interface Part {
	anims: { SUB: unknown[] };
	collType: COLLTYPE;
	group: string;
	heightShape: COLL_HEIGHT_SHAPE;
	pos: Point3;
	size: Point3;
}

enum COLL_HEIGHT_SHAPE {
	NONE,
	NORTH_UP,
	EAST_UP,
	WEST_UP,
	SOUTH_UP,
}

enum COLLTYPE {
	NONE,
	IGNORE,
	PROJECTILE,
	VIRTUAL,
	PBLOCK,
	NPBLOCK,
	BLOCK,
	TRIGGER,
	PASSIVE,
	SEMI_IGNORE,
	FENCE,
	NPFENCE,
}
