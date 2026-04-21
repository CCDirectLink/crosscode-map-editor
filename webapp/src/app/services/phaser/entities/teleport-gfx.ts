import { Anims } from '../sheet-parser';

export interface TeleportGfxObj {
	gfx: (sheet?: string, xCount?: number, offX?: number, offY?: number) => Anims;
}

export const TELEPORT_GFX: Record<string, TeleportGfxObj | undefined> = {
	SOLID: {
		gfx: function (sheet, xCount, offX, offY) {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: sheet,
					width: 32,
					height: 32,
					xCount: xCount,
					offX: offX,
					offY: offY,
				},
				SUB: [{
					name: 'inactive',
					time: 1,
					frames: [0],
					repeat: false,
				}, {
					name: 'active',
					time: 1,
					frames: [1],
					repeat: false,
				}, {
					name: 'red',
					time: 1,
					frames: [2],
					repeat: false,
				}],
			};
		},
	},
	AR: {
		gfx: function () {
			return {
				offset: {
					x: 0,
					y: 5,
					z: 0,
				},
				SUB: [{
					shapeType: 'Z_FLAT',
					sheet: {
						src: 'media/entity/objects/upgrade-symbol.png',
						width: 32,
						height: 32,
						xCount: 2,
						offX: 160,
						offY: 0,
					},
					frames: [0, 0, 0, 1, 2, 3, 4, 5],
					time: 0.07,
					repeat: true,
					SUB: [{
						name: 'inactive',
					}, {
						name: 'active',
					}, {
						name: 'red',
					}],
				}, {
					renderMode: 'lighter',
					sheet: {
						src: 'media/entity/objects/upgrade-symbol.png',
						width: 32,
						height: 40,
						xCount: 1,
						offX: 224,
					},
					wallY: 1,
					shapeType: 'Z_EXPAND',
					frames: [0, 1, 2],
					time: 0.1,
					repeat: true,
					SUB: [{
						name: 'inactive',
					}, {
						name: 'active',
					}, {
						name: 'red',
					}],
				}],
			};
		},
	},
	AR_FINAL: {
		gfx: function () {
			return {
				offset: {
					x: 0,
					y: 5,
					z: 0,
				},
				SUB: [{
					shapeType: 'Z_FLAT',
					sheet: {
						src: 'media/entity/objects/upgrade-symbol.png',
						width: 32,
						height: 32,
						xCount: 2,
						offX: 32,
						offY: 64,
					},
					frames: [0],
					time: 0.07,
					repeat: true,
					SUB: [{
						name: 'inactive',
					}, {
						name: 'active',
					}, {
						name: 'red',
					}],
				}, {
					renderMode: 'lighter',
					sheet: {
						src: 'media/entity/objects/upgrade-symbol.png',
						width: 32,
						height: 40,
						xCount: 1,
						offX: 224,
					},
					wallY: 1,
					shapeType: 'Z_EXPAND',
					frames: [0, 1, 2],
					time: 0.1,
					repeat: true,
					SUB: [{
						name: 'inactive',
					}, {
						name: 'active',
					}, {
						name: 'red',
					}],
				}],
			};
		},
	},
	RHOMBUS_SQR_LEFT: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/rhombus-outside.png',
					width: 32,
					height: 32,
					xCount: 1,
					offX: 480,
					offY: 0,
				},
				time: 1,
				frames: [0],
				repeat: false,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
				}, {
					name: 'red',
				}],
			};
		},
	},
	RHOMBUS_SQR_RIGHT: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 1,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/rhombus-outside.png',
					width: 32,
					height: 32,
					xCount: 1,
					offX: 480,
					offY: 0,
				},
				time: 1,
				frames: [0],
				repeat: false,
				flipX: true,
				SUB: [{
					name: 'inactive',
				},
					{
						name: 'active',
					}, {
						name: 'red',
					},
				],
			};
		},
	},
	BERGEN_LEFT: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/bergen-trail.png',
					width: 32,
					height: 32,
					xCount: 1,
					offX: 256,
					offY: 576,
				},
				time: 1,
				frames: [0],
				repeat: false,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
				}, {
					name: 'red',
				}],
			};
		},
	},
	HEAT_RIGHT: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/heat-area.png',
					width: 32,
					height: 32,
					xCount: 1,
					offX: 64,
					offY: 688,
				},
				time: 1,
				frames: [0],
				repeat: false,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
				},
					{
						name: 'red',
					},
				],
			};
		},
	},
	WAVE_UP: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				renderMode: 'lighter',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/entity/objects/upgrade-symbol.png',
					width: 32,
					height: 32,
					xCount: 4,
					offX: 0,
					offY: 96,
				},
				time: 0.2,
				frames: [0, 1, 2, 3],
				repeat: true,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
				}, {
					name: 'red',
				}],
			};
		},
	},
	WAVE_DOWN: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				renderMode: 'lighter',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/entity/objects/upgrade-symbol.png',
					width: 32,
					height: 32,
					xCount: 4,
					offX: 0,
					offY: 96,
				},
				time: 0.2,
				frames: [3, 2, 1, 0],
				repeat: true,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
				}, {
					name: 'red',
				}],
			};
		},
	},
	RHOMBUS_SQR_STATION: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/rhombus-outside.png',
					width: 32,
					height: 32,
					xCount: 2,
					offX: 416,
					offY: 0,
				},
				time: 1,
				repeat: false,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
					frames: [1],
				}, {
					name: 'red',
					frames: [0],
				}],
			};
		},
	},
	RHOMBUS_SQR_STATION_START: {
		gfx: function () {
			return {
				shapeType: 'Z_FLAT',
				offset: {
					x: 0,
					y: 4,
					z: 0,
				},
				sheet: {
					src: 'media/map/rhombus-outside.png',
					width: 32,
					height: 32,
					xCount: 1,
					offX: 416,
					offY: 32,
				},
				time: 1,
				repeat: false,
				SUB: [{
					name: 'inactive',
				}, {
					name: 'active',
					frames: [0],
				}, {
					name: 'red',
					frames: [1],
				}],
			};
		},
	},
} as const;
