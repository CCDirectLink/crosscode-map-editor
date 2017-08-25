export interface PropSheet {
	DOCTYPE: string;
	props: Prop[];
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
