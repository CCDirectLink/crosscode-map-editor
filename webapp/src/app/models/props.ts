import {Point, Point3} from './cross-code-map';
import {Prop} from '../shared/phaser/entities/prop';

export interface PropSheet {
	DOCTYPE: string;
	props: Prop[];
}

export interface ScalablePropSheet {
	jsonTEMPLATES?: any;
	DOCTYPE: string;
	entries: any;
}

export interface Fix {
	gfx: string;
	x: number;
	y: number;
	w: number;
	h: number;
	offsetX?: number;
	offsetY?: number;
	renderMode?: string;
	flipX: boolean;
}
