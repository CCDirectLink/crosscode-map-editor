import {Point, Point3} from './cross-code-map';
import {Fix} from './props';

export interface EntityDefinition {
	type: string;
	attributes: any;
	definitionAttribute: string;
	definitionRef?: string;
	definitions: {
		[s: string]: {
			size: Point3
			fix?: Fix[],
			offset?: Point,
			flipX?: boolean,
			color?: {
				r: number,
				g: number,
				b: number,
				a?: number
			}
		}
	};
	scalableX: boolean;
	scalableY: boolean;
}
