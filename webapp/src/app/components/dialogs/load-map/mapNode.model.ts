import { AssetFile } from '../../../services/assets-access.service';

/**
 * An interface that contains the full information about a map tree.
 */
export interface MapNode {
	name: string;
	displayed: boolean;
	file?: AssetFile;
	children?: MapNode[];
}

export interface MapNodeRoot extends MapNode {
	children: MapNode[];
}
