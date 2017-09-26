import {Point3} from './cross-code-map';
import {Fix} from './props';

export interface EntityDefinition {
	type: string;
	attributes: any;
	definitionAttribute: string;
	definitions: {[s: string]: {
		size: Point3
		fix: Fix[],
		flipX?: boolean
	}};
	scalableX: boolean;
	scalableY: boolean;
}
