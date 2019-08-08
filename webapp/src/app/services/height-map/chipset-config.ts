import {Point} from '../../models/cross-code-map';
import {GFX_TYPE} from './heightmap.constants';

export interface ChipsetConfig {
	tileCountX: number;
	base: ChipsetBase;
	terrains?: ChipsetBase[];
	mappingType?: string;
}

export interface ChipsetBase {
	ground: Point;
	cliff: Point;
	cliffAlt?: Point;
	mappingType?: string;
	blockedTypes?: GFX_TYPE[];
	chasmOnly?: boolean;
	border?: boolean;
	shadow?: Point;
	baseTerrain?: number;
	overrideWallBase?: boolean;
	wallTerrainPrio?: number;
}


export const CHIPSET_CONFIG: {
	[key: string]: ChipsetConfig
} = {};

CHIPSET_CONFIG['media/map/autumn-outside.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 5},
		blockedTypes: [GFX_TYPE.CORNER_SW, GFX_TYPE.CORNER_SE]
	},
	terrains: [
		{
			ground: {x: 0, y: 1},
			cliff: {x: 0, y: 5},
			border: true
		}
	]
};

CHIPSET_CONFIG['media/map/old-hideout.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 5},
		blockedTypes: [GFX_TYPE.CORNER_SW, GFX_TYPE.CORNER_SE]
	}
	
};

CHIPSET_CONFIG['media/map/bergen-trail.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		blockedTypes: []
	},
	terrains: [{
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 6,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 1,
			y: 2
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 12,
			y: 12
		},
		cliff: {
			x: 12,
			y: 8
		},
		border: true
	}]
};
CHIPSET_CONFIG['media/map/heat-area.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		shadow: {
			x: 6,
			y: 6
		},
		blockedTypes: [],
		chasmOnly: true
	},
	terrains: [{
		ground: {
			x: 11,
			y: 0
		},
		cliff: {
			x: 6,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 12,
			y: 12
		},
		cliff: {
			x: 12,
			y: 8
		},
		border: true
	}, {
		ground: {
			x: 1,
			y: 2
		},
		cliff: {
			x: 18,
			y: 4
		},
		border: true
	}]
};
CHIPSET_CONFIG['media/map/cave.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		shadow: {
			x: 6,
			y: 4
		}
	},
	terrains: [{
		ground: {
			x: 2,
			y: 0
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: false,
		shadow: {
			x: 12,
			y: 9
		}
	}, {
		ground: {
			x: 8,
			y: 0
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: false,
		shadow: {
			x: 12,
			y: 9
		}
	}, {
		ground: {
			x: 8,
			y: 1
		},
		cliff: {
			x: 18,
			y: 4
		},
		border: false,
		shadow: {
			x: 18,
			y: 9
		}
	}, {
		ground: {
			x: 24,
			y: 8
		},
		cliff: {
			x: 24,
			y: 4
		},
		border: false,
		shadow: {
			x: 24,
			y: 9
		}
	}]
};
CHIPSET_CONFIG['media/map/cold-dng.png'] = {
	tileCountX: 32,
	mappingType: 'TYPE1',
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		shadow: {
			x: 6,
			y: 4
		}
	},
	terrains: [{
		mappingType: 'TYPE2',
		ground: {
			x: 12,
			y: 0
		},
		cliff: {
			x: 12,
			y: 4
		},
		shadow: {
			x: 17,
			y: 4
		}
	}, {
		baseTerrain: 1,
		ground: {
			x: 20,
			y: 0
		},
		cliff: {
			x: 22,
			y: 4
		}
	}]
};
CHIPSET_CONFIG['media/map/heat-dng.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		shadow: {
			x: 5,
			y: 4
		}
	},
	terrains: [{
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 9,
			y: 0
		},
		cliff: {
			x: 15,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 19,
			y: 2
		},
		cliff: {
			x: 20,
			y: 4
		},
		border: false
	}, {
		ground: {
			x: 26,
			y: 7
		},
		cliff: {
			x: 25,
			y: 4
		},
		border: false,
		overrideWallBase: true
	}]
};
CHIPSET_CONFIG['media/map/jungle.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		shadow: {
			x: 6,
			y: 6
		},
		blockedTypes: [],
		chasmOnly: true
	},
	terrains: [{
		ground: {
			x: 0,
			y: 1
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: false
	}, {
		ground: {
			x: 6,
			y: 0
		},
		cliff: {
			x: 18,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 12,
			y: 12
		},
		cliff: {
			x: 12,
			y: 8
		},
		border: true
	}, {
		mappingType: 'TYPE1',
		ground: {
			x: 7,
			y: 10
		},
		cliff: {
			x: 6,
			y: 4
		}
	}, {
		baseTerrain: 4,
		ground: {
			x: 0,
			y: 1
		},
		cliff: {
			x: 24,
			y: 4
		},
		border: false
	}, {
		ground: {
			x: 19,
			y: 2
		},
		cliff: {
			x: 24,
			y: 2
		},
		border: false
	}, {
		baseTerrain: 4,
		ground: {
			x: 19,
			y: 2
		},
		cliff: {
			x: 24,
			y: 3
		},
		border: false
	}]
};
CHIPSET_CONFIG['media/map/shockwave-dng.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		shadow: {
			x: 5,
			y: 4
		}
	},
	terrains: [{
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 9,
			y: 0
		},
		cliff: {
			x: 15,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 20,
			y: 4
		},
		cliff: {
			x: 20,
			y: 4
		},
		border: false,
		overrideWallBase: true
	}, {
		mappingType: 'TYPE1',
		ground: {
			x: 25,
			y: 0
		},
		cliff: {
			x: 25,
			y: 2
		},
		shadow: {
			x: 24,
			y: 36
		}
	}, {
		ground: {
			x: 3,
			y: 2
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true,
		baseTerrain: 0
	}, {
		ground: {
			x: 18,
			y: 43
		},
		cliff: {
			x: 18,
			y: 38
		},
		baseTerrain: 4
	}]
};
CHIPSET_CONFIG['media/map/tree-inner.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		shadow: {
			x: 5,
			y: 4
		}
	},
	terrains: [{
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 9,
			y: 0
		},
		cliff: {
			x: 15,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 20,
			y: 4
		},
		cliff: {
			x: 20,
			y: 4
		},
		border: false,
		overrideWallBase: true
	}, {
		mappingType: 'TYPE1',
		ground: {
			x: 25,
			y: 0
		},
		cliff: {
			x: 25,
			y: 2
		},
		shadow: {
			x: 24,
			y: 36
		}
	}, {
		ground: {
			x: 3,
			y: 2
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true,
		baseTerrain: 0
	}, {
		ground: {
			x: 18,
			y: 43
		},
		cliff: {
			x: 18,
			y: 38
		},
		baseTerrain: 4
	}]
};
CHIPSET_CONFIG['media/map/arid.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		cliffAlt: {
			x: 0,
			y: 10
		},
		blockedTypes: []
	},
	terrains: [{
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 6,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 3,
			y: 2
		},
		cliff: {
			x: 12,
			y: 4
		},
		border: true
	}, {
		ground: {
			x: 12,
			y: 12
		},
		cliff: {
			x: 12,
			y: 8
		},
		border: true
	}, {
		mappingType: 'TYPE2',
		ground: {
			x: 11,
			y: 0
		},
		cliff: {
			x: 0,
			y: 12
		},
		wallTerrainPrio: 1
	}, {
		ground: {
			x: 1,
			y: 21
		},
		cliff: {
			x: 0,
			y: 20
		},
		baseTerrain: 4,
		wallTerrainPrio: 1
	}]
};
CHIPSET_CONFIG['media/map/arid-interior.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 4
		},
		shadow: {
			x: 5,
			y: 4
		}
	},
	terrains: [{
		ground: {
			x: 0,
			y: 1
		},
		cliff: {
			x: 10,
			y: 4
		},
		border: true
	}, {
		mappingType: 'TYPE2',
		ground: {
			x: 1,
			y: 0
		},
		cliff: {
			x: 15,
			y: 4
		},
		shadow: {
			x: 20,
			y: 4
		},
		border: false
	}, {
		ground: {
			x: 11,
			y: 0
		},
		cliff: {
			x: 25,
			y: 4
		},
		border: true,
		baseTerrain: 2
	}]
};
CHIPSET_CONFIG['media/map/forest.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {
			x: 0,
			y: 0
		},
		cliff: {
			x: 0,
			y: 5
		},
		blockedTypes: []
	},
	terrains: [{
		ground: {
			x: 6,
			y: 10
		},
		cliff: {
			x: 6,
			y: 6
		},
		border: true
	}, {
		mappingType: 'TYPE1',
		ground: {
			x: 2,
			y: 12
		},
		cliff: {
			x: 0,
			y: 11
		},
		blockedTypes: [],
		wallTerrainPrio: 1
	}]
};
CHIPSET_CONFIG['media/map/rhombus-outside.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {
			x: 1,
			y: 5
		},
		cliff: {
			x: 0,
			y: 4
		},
		blockedTypes: [],
		wallTerrainPrio: 1
	},
	terrains: [{
		ground: {
			x: 1,
			y: 5
		},
		cliff: {
			x: 5,
			y: 4
		},
		blockedTypes: [],
		wallTerrainPrio: 0.5
	}, {
		ground: {
			x: 11,
			y: 20
		},
		cliff: {
			x: 10,
			y: 19
		},
		blockedTypes: [],
		wallTerrainPrio: 0.5
	}, {
		mappingType: 'TYPE1',
		ground: {
			x: 6,
			y: 32
		},
		cliff: {
			x: 0,
			y: 32
		},
		blockedTypes: []
	}, {
		ground: {
			x: 6,
			y: 32
		},
		cliff: {
			x: 8,
			y: 21
		},
		blockedTypes: [],
		wallTerrainPrio: 1,
		overrideWallBase: true
	}, {
		ground: {
			x: 6,
			y: 35
		},
		cliff: {
			x: 6,
			y: 31
		},
		blockedTypes: [],
		baseTerrain: 3
	}]
};

