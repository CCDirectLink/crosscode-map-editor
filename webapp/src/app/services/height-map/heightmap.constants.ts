export interface WallLink {
	wall: GFX_TYPE;
	base: GFX_TYPE;
	shadowOnly?: boolean;
	toMaster?: boolean;
	deltaY?: number;
}

export interface AllCheckDirs {
	NORTH: CheckDir;
	EAST: CheckDir;
	SOUTH: CheckDir;
	WEST: CheckDir;
	NE: CheckDir;
	SE: CheckDir;
	SW: CheckDir;
	NW: CheckDir;
}

export interface CheckDir {
	dx: number;
	dy: number;
	blockType1: FILL_TYPE;
	blockType2: FILL_TYPE;
	gfx: GFX_TYPE;
	terrainBorder?: {
		dx: number;
		dy: number;
	}[];
}

export enum FILL_TYPE {
	ROUND,
	SQUARE,
	NORTHEAST,
	SOUTHEAST,
	SOUTHWEST,
	NORTHWEST,
}

export enum GFX_TYPE {
	FILL = 'FILL',

	DIAGONAL_NE = 'DIAGONAL_NE',
	DIAGONAL_SE = 'DIAGONAL_SE',
	DIAGONAL_SW = 'DIAGONAL_SW',
	DIAGONAL_NW = 'DIAGONAL_NW',

	SQUARE_NE = 'SQUARE_NE',
	SQUARE_SE = 'SQUARE_SE',
	SQUARE_SW = 'SQUARE_SW',
	SQUARE_NW = 'SQUARE_NW',

	NORTH = 'NORTH',
	EAST = 'EAST',
	SOUTH = 'SOUTH',
	WEST = 'WEST',

	CORNER_NE = 'CORNER_NE',
	CORNER_SE = 'CORNER_SE',
	CORNER_SW = 'CORNER_SW',
	CORNER_NW = 'CORNER_NW',

	WALL_SOUTH = 'WALL_SOUTH',
	WALL_SOUTH_BASE = 'WALL_SOUTH_BASE',

	WALL_SE = 'WALL_SE',
	WALL_SE_BASE = 'WALL_SE_BASE',

	WALL_SW = 'WALL_SW',
	WALL_SW_BASE = 'WALL_SW_BASE',

	WALL_SQR_SW = 'WALL_SQR_SW',
	WALL_SQR_SW_BASE = 'WALL_SQR_SW_BASE',

	WALL_SQR_SE = 'WALL_SQR_SE',
	WALL_SQR_SE_BASE = 'WALL_SQR_SE_BASE',

	WALL_END_WEST = 'WALL_END_WEST',
	WALL_END_WEST_BASE = 'WALL_END_WEST_BASE',

	WALL_END_EAST = 'WALL_END_EAST',
	WALL_END_EAST_BASE = 'WALL_END_EAST_BASE',

	INVISIBLE_WALL = 'INVISIBLE_WALL',
}

export enum SUB_TYPE {
	SHADOW = 'SHADOW',
	CHASM = 'CHASM',
	CHASM_FLOOR = 'CHASM_FLOOR',
	DARK_WALL = 'DARK_WALL',
	BACK_WALL = 'BACK_WALL',
}

export const WALL_LINK: Record<GFX_TYPE, WallLink> = {} as any;
WALL_LINK[GFX_TYPE.SOUTH] = {
	wall: GFX_TYPE.WALL_SOUTH,
	base: GFX_TYPE.WALL_SOUTH_BASE,
};
WALL_LINK[GFX_TYPE.DIAGONAL_SW] = {
	wall: GFX_TYPE.WALL_SW,
	base: GFX_TYPE.WALL_SW_BASE,
};
WALL_LINK[GFX_TYPE.DIAGONAL_SE] = {
	wall: GFX_TYPE.WALL_SE,
	base: GFX_TYPE.WALL_SE_BASE,
};
WALL_LINK[GFX_TYPE.SQUARE_SW] = {
	wall: GFX_TYPE.WALL_SQR_SW,
	base: GFX_TYPE.WALL_SQR_SW_BASE,
};
WALL_LINK[GFX_TYPE.SQUARE_SE] = {
	wall: GFX_TYPE.WALL_SQR_SE,
	base: GFX_TYPE.WALL_SQR_SE_BASE,
};
WALL_LINK[GFX_TYPE.CORNER_SW] = {
	shadowOnly: true,
	wall: GFX_TYPE.WALL_END_WEST,
	base: GFX_TYPE.WALL_END_WEST_BASE,
};
WALL_LINK[GFX_TYPE.CORNER_SE] = {
	shadowOnly: true,
	wall: GFX_TYPE.WALL_END_EAST,
	base: GFX_TYPE.WALL_END_EAST_BASE,
};
WALL_LINK[GFX_TYPE.NORTH] = {
	shadowOnly: true,
	toMaster: true,
	deltaY: -1,
	wall: GFX_TYPE.WALL_SOUTH,
	base: GFX_TYPE.WALL_SOUTH_BASE,
};
WALL_LINK[GFX_TYPE.DIAGONAL_NE] = {
	shadowOnly: true,
	toMaster: true,
	wall: GFX_TYPE.WALL_SW,
	base: GFX_TYPE.WALL_SW_BASE,
};
WALL_LINK[GFX_TYPE.DIAGONAL_NW] = {
	shadowOnly: true,
	toMaster: true,
	wall: GFX_TYPE.WALL_SE,
	base: GFX_TYPE.WALL_SE_BASE,
};
WALL_LINK[GFX_TYPE.SQUARE_NE] = {
	shadowOnly: true,
	toMaster: true,
	deltaY: -1,
	wall: GFX_TYPE.WALL_SOUTH,
	base: GFX_TYPE.WALL_SOUTH_BASE,
};
WALL_LINK[GFX_TYPE.SQUARE_NW] = {
	shadowOnly: true,
	toMaster: true,
	deltaY: -1,
	wall: GFX_TYPE.WALL_SOUTH,
	base: GFX_TYPE.WALL_SOUTH_BASE,
};

export const DIAG_GFX: Record<FILL_TYPE, GFX_TYPE> = {} as any;
DIAG_GFX[FILL_TYPE.NORTHEAST] = GFX_TYPE.DIAGONAL_NE;
DIAG_GFX[FILL_TYPE.SOUTHEAST] = GFX_TYPE.DIAGONAL_SE;
DIAG_GFX[FILL_TYPE.SOUTHWEST] = GFX_TYPE.DIAGONAL_SW;
DIAG_GFX[FILL_TYPE.NORTHWEST] = GFX_TYPE.DIAGONAL_NW;

export const SQUARE_CORNER_CHECK: {
	dir1: keyof AllCheckDirs;
	dir2: keyof AllCheckDirs;
	gfx: GFX_TYPE;
}[] = [
	{ dir1: 'NORTH', dir2: 'EAST', gfx: GFX_TYPE.SQUARE_NE },
	{ dir1: 'NORTH', dir2: 'WEST', gfx: GFX_TYPE.SQUARE_NW },
	{ dir1: 'SOUTH', dir2: 'EAST', gfx: GFX_TYPE.SQUARE_SE },
	{ dir1: 'SOUTH', dir2: 'WEST', gfx: GFX_TYPE.SQUARE_SW },
];

export const CHECK_DIR: AllCheckDirs = {
	NORTH: {
		dx: 0,
		dy: -1,
		blockType1: FILL_TYPE.SOUTHEAST,
		blockType2: FILL_TYPE.SOUTHWEST,
		gfx: GFX_TYPE.NORTH,
		terrainBorder: [
			{ dx: -1, dy: 0 },
			{ dx: 1, dy: 0 },
		],
	},
	EAST: {
		dx: 1,
		dy: 0,
		blockType1: FILL_TYPE.SOUTHWEST,
		blockType2: FILL_TYPE.NORTHWEST,
		gfx: GFX_TYPE.EAST,
		terrainBorder: [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 1 },
		],
	},
	SOUTH: {
		dx: 0,
		dy: 1,
		blockType1: FILL_TYPE.NORTHEAST,
		blockType2: FILL_TYPE.NORTHWEST,
		gfx: GFX_TYPE.SOUTH,
		terrainBorder: [
			{ dx: -1, dy: 0 },
			{ dx: 1, dy: 0 },
		],
	},
	WEST: {
		dx: -1,
		dy: 0,
		blockType1: FILL_TYPE.NORTHEAST,
		blockType2: FILL_TYPE.SOUTHEAST,
		gfx: GFX_TYPE.WEST,
		terrainBorder: [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 1 },
		],
	},
	NE: {
		dx: 1,
		dy: -1,
		blockType1: FILL_TYPE.SOUTHWEST,
		blockType2: FILL_TYPE.SOUTHWEST,
		gfx: GFX_TYPE.CORNER_NE,
	},
	SE: {
		dx: 1,
		dy: 1,
		blockType1: FILL_TYPE.NORTHWEST,
		blockType2: FILL_TYPE.NORTHWEST,
		gfx: GFX_TYPE.CORNER_SE,
	},
	SW: {
		dx: -1,
		dy: 1,
		blockType1: FILL_TYPE.NORTHEAST,
		blockType2: FILL_TYPE.NORTHEAST,
		gfx: GFX_TYPE.CORNER_SW,
	},
	NW: {
		dx: -1,
		dy: -1,
		blockType1: FILL_TYPE.SOUTHEAST,
		blockType2: FILL_TYPE.SOUTHEAST,
		gfx: GFX_TYPE.CORNER_NW,
	},
};

export const CHECK_ITERATE: (keyof AllCheckDirs)[] = [];
for (const name in CHECK_DIR) {
	if (name in CHECK_DIR) {
		CHECK_ITERATE.push(name as keyof AllCheckDirs);
	}
}

export const SECOND_LEVEL_CHECK: Record<FILL_TYPE, CheckDir[]> = {} as any;
SECOND_LEVEL_CHECK[FILL_TYPE.NORTHEAST] = [
	CHECK_DIR.NORTH,
	CHECK_DIR.EAST,
	CHECK_DIR.NE,
];
SECOND_LEVEL_CHECK[FILL_TYPE.SOUTHEAST] = [
	CHECK_DIR.SOUTH,
	CHECK_DIR.EAST,
	CHECK_DIR.SE,
];
SECOND_LEVEL_CHECK[FILL_TYPE.SOUTHWEST] = [
	CHECK_DIR.SOUTH,
	CHECK_DIR.WEST,
	CHECK_DIR.SW,
];
SECOND_LEVEL_CHECK[FILL_TYPE.NORTHWEST] = [
	CHECK_DIR.NORTH,
	CHECK_DIR.WEST,
	CHECK_DIR.NW,
];

export const SHADOW_CORNER_EXCEPTION: Record<
	GFX_TYPE,
	{ test: GFX_TYPE; set: GFX_TYPE }
> = {} as any;
SHADOW_CORNER_EXCEPTION[GFX_TYPE.CORNER_NE] = {
	test: GFX_TYPE.EAST,
	set: GFX_TYPE.FILL,
};
SHADOW_CORNER_EXCEPTION[GFX_TYPE.CORNER_NW] = {
	test: GFX_TYPE.WEST,
	set: GFX_TYPE.FILL,
};
SHADOW_CORNER_EXCEPTION[GFX_TYPE.EAST] = {
	test: GFX_TYPE.DIAGONAL_NE,
	set: GFX_TYPE.CORNER_NE,
};
SHADOW_CORNER_EXCEPTION[GFX_TYPE.WEST] = {
	test: GFX_TYPE.DIAGONAL_NW,
	set: GFX_TYPE.CORNER_NW,
};

export const FILL_COUNT = 8;
export const LEVEL_COUNT = 16;
