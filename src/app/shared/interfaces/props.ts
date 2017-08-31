import {Point, Point3} from './cross-code-map';

export interface PropSheet {
	DOCTYPE: string;
	props: Prop[];
}

export interface ScalablePropSheet {
	DOCTYPE: string;
	entries: any;
}

export interface Prop {
	name: string;
	size: {
		x: number;
		y: number;
		z: number
	};
	collType: string;
	fix: {
		gfx: string;
		x: number;
		y: number;
		w: number;
		h: number;
		flipX: boolean;
	};
}

export interface ScalableProp {
	baseSize: Point3;
	terrain: string;
	scalableX: boolean;
	scalableY: boolean;
	scalableStep: number;
	renderMode: string;
	collType: string;
	gfx: string;
	gfxBaseX: number;
	gfxBaseY: number;
	patterns: {
		x: number;
		y: number;
		w: number;
		h: number;
		xCount: number;
		yCount: number;
	};
	timePadding: Point;
	effects: {
		sheet: string;
		show: string;
		hide: string;
	};
	pivot: Point;
}
