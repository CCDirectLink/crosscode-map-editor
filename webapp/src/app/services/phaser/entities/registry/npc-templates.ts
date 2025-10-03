import { Anims, SubJsonParam } from '../../sheet-parser';
import { Configs, Face, WalkAnimSet } from './npc';

export type NPCTemplates = Record<string, NPCTemplate>;

export interface NPCTemplate {
	name: SubJsonParam;
	gender: SubJsonParam;
	animSheet: Anims;
	walkAnimSet: WalkAnimSet;
	walkAnims: string;
	configs: Configs;
	face: Face;
	realname?: SubJsonParam;
}

export function getNPCTemplates(): NPCTemplates {
	return {
		NPCBasic: {
			name: { jsonPARAM: 'name', default: null },
			gender: { jsonPARAM: 'gender', default: null },
			animSheet: {
				DOCTYPE: 'MULTI_DIR_ANIMATION',
				namedSheets: {
					move: {
						// @ts-expect-error types don't consider jsonPARAM
						src: { jsonPARAM: 'img' },
						width: 32,
						height: 40,
						xCount: 3,
						// @ts-expect-error types don't consider jsonPARAM
						offX: { jsonPARAM: 'x' },
						// @ts-expect-error types don't consider jsonPARAM
						offY: { jsonPARAM: 'y' },
					},
					sit: {
						jsonIF: 'sitX',
						// @ts-expect-error types don't consider jsonPARAM
						src: { jsonPARAM: 'img' },
						width: 32,
						height: 40,
						xCount: 1,
						// @ts-expect-error types don't consider jsonPARAM
						offX: { jsonPARAM: 'sitX' },
						// @ts-expect-error types don't consider jsonPARAM
						offY: { jsonPARAM: 'sitY' },
					},
				},
				shapeType: 'Y_FLAT',
				offset: { x: 0, y: -2, z: 0 },
				SUB: [
					{
						sheet: 'move',
						dirs: 4,
						flipX: [0, 0, 0, 1],
						tileOffsets: [0, 3, 6, 3],
						SUB: [
							{
								name: 'idle',
								time: 1,
								repeat: false,
								frames: [1],
							},
							{
								name: 'walk',
								time: 0.133,
								repeat: true,
								frames: [0, 1, 2, 1],
							},
						],
					},
					{
						jsonIF: 'sitX',
						sheet: 'sit',
						dirs: 4,
						flipX: [0, 0, 0, 1],
						tileOffsets: [0, 1, 2, 1],
						SUB: [
							{
								name: 'sit',
								time: 1,
								repeat: false,
								frames: [0],
							},
						],
					},
				],
			},
			walkAnimSet: {
				normal: {
					idle: 'idle',
					move: 'walk',
				},
				sit: {
					jsonIF: 'sitX',
					idle: 'sit',
				},
			},
			walkAnims: 'normal',
			configs: {
				normal: {
					relativeVel: 0.5,
				},
				sit: {
					jsonIF: 'sitX',
					walkAnims: 'sit',
					shadow: 0,
				},
			},
			face: { ABSTRACT: { jsonPARAM: 'face' } },
		},
		NPCAvatarSimple: {
			name: { jsonPARAM: 'name', default: null },
			realname: { jsonPARAM: 'realname', default: null },
			gender: { jsonPARAM: 'gender', default: null },
			animSheet: {
				DOCTYPE: 'MULTI_DIR_ANIMATION',
				namedSheets: {
					move: {
						// @ts-expect-error types don't consider jsonPARAM
						src: { jsonPARAM: 'img' },
						width: 32,
						height: 40,
						xCount: 3,
						// @ts-expect-error types don't consider jsonPARAM
						offX: { jsonPARAM: 'x' },
						// @ts-expect-error types don't consider jsonPARAM
						offY: { jsonPARAM: 'y' },
					},
					offline: {
						// @ts-expect-error types don't consider jsonPARAM
						src: { jsonPARAM: 'img' },
						width: 32,
						height: 40,
						xCount: 3,
						// @ts-expect-error types don't consider jsonPARAM
						offX: { jsonPARAM: 'offlineX' },
						// @ts-expect-error types don't consider jsonPARAM
						offY: { jsonPARAM: 'offlineY' },
					},
					run: {
						jsonIF: 'runSrc',
						// @ts-expect-error types don't consider jsonPARAM
						src: { jsonPARAM: 'runSrc' },
						width: 32,
						height: 40,
						xCount: 5,
						// @ts-expect-error types don't consider jsonPARAM
						offX: { jsonPARAM: 'runX' },
						// @ts-expect-error types don't consider jsonPARAM
						offY: { jsonPARAM: 'runY' },
					},
				},
				shapeType: 'Y_FLAT',
				offset: { x: 0, y: -2, z: 0 },
				SUB: [
					{
						sheet: 'move',
						dirs: 4,
						flipX: [0, 0, 0, 1],
						tileOffsets: [0, 3, 6, 3],
						SUB: [
							{
								name: 'idle',
								time: 1,
								repeat: false,
								frames: [1],
							},
							{
								name: 'walk',
								time: 0.133,
								repeat: true,
								frames: [0, 1, 2, 1],
							},
							{
								sheet: 'offline',
								name: 'offline',
								time: 0.166,
								repeat: true,
								frames: [0, 1, 2],
							},
						],
					},
					{
						jsonIF: 'runSrc',
						sheet: 'run',
						dirs: 6,
						flipX: [0, 0, 0, 1, 1, 1],
						tileOffsets: [0, 5, 10, 10, 5, 0],
						SUB: [
							{
								name: 'run',
								time: 0.1,
								repeat: true,
								frames: [0, 1, 2, 3],
							},
							{
								name: 'jump',
								time: 0.1,
								repeat: true,
								frames: [3],
							},
							{
								name: 'fall',
								time: 0.1,
								repeat: true,
								frames: [4],
							},
						],
					},
					{
						sheet: 'move',
						dirs: 2,
						flipX: [0, 1],
						tileOffsets: [9, 9],
						SUB: [
							{
								name: 'ground',
								time: 1,
								repeat: false,
								frames: [0],
								offset: { x: 0, y: 2, z: 0 },
							},
						],
					},
				],
			},
			walkAnimSet: {
				normal: {
					idle: 'idle',
					move: 'walk',
					run: { jsonIF: 'runSrc', jsonTHEN: 'run' },
					jump: { jsonIF: 'runSrc', jsonTHEN: 'jump' },
					fall: { jsonIF: 'runSrc', jsonTHEN: 'fall' },
				},
				ground: {
					idle: 'ground',
				},
				offline: {
					idle: 'offline',
				},
			},
			walkAnims: 'normal',
			configs: {
				normal: {
					relativeVel: 0.5,
				},
				run: {
					jsonIF: 'runSrc',
					relativeVel: 1,
				},
				ground: {
					walkAnims: 'ground',
				},
				offline: {
					walkAnims: 'offline',
				},
			},
			face: { ABSTRACT: { jsonPARAM: 'face' } },
		},
	};
}
