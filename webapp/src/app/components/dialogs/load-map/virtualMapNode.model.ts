import { AssetFile } from '../../../services/assets-access.service';
import { MapNode } from './mapNode.model';

const collator = new Intl.Collator(undefined, { numeric: true });

/**
 * A class that only returns the children that are included in the filter.
 */
export class VirtualMapNode {
	public names: string[] = [];
	public children?: VirtualMapNode[];
	public mapCount = 0;

	private original: MapNode;
	private knownChildren = new WeakMap<MapNode, VirtualMapNode>();

	public constructor(original: MapNode) {
		this.original = original;
	}

	public get file(): AssetFile | undefined {
		return this.original.file;
	}

	public get section(): boolean {
		return !!this.original.section;
	}

	public refresh() {
		this.names = [this.original.name];
		if (!this.original.children) {
			this.mapCount = 1;
			return;
		}

		const displayed = this.original.children.filter(n => n.displayed);
		if (!this.isRoot) {
			displayed.sort((a, b) => this.sort(a, b));
		}

		const children = displayed.map(n => this.resolve(n));
		this.mapCount = 0;
		for (const child of children) {
			child.refresh();
			this.mapCount += child.mapCount;
		}

		const singleDirectory = children.length === 1
			&& children[0].children !== undefined
			&& !this.isRoot
			&& !this.section;
		if (singleDirectory) {
			this.names = this.names.concat(children[0].names);
			this.children = children[0].children;
		} else {
			this.children = children;
		}
	}

	private resolve(node: MapNode): VirtualMapNode {
		const known = this.knownChildren.get(node);
		if (known) {
			return known;
		}

		const result = new VirtualMapNode(node);
		this.knownChildren.set(node, result);
		return result;
	}

	private get isRoot(): boolean {
		return this.original.name === '';
	}

	private sort(a: MapNode, b: MapNode): number {
		const aIsDir = a.children !== undefined;
		const bIsDir = b.children !== undefined;

		if (aIsDir !== bIsDir) {
			return aIsDir ? -1 : 1;
		}

		return collator.compare(a.name, b.name);
	}
}
