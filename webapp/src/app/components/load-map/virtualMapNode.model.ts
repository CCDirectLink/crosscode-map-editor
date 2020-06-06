import { MapNode } from './mapNode.model';

/**
 * A class that only returns the children that are included in the filter.
 */
export class VirtualMapNode {
	private original: MapNode;
	private knownChildren = new WeakMap<MapNode, VirtualMapNode>();
	
	public constructor(original: MapNode) {
		this.original = original;

		if (original.children) {
			for (const node of original.children) {
				this.knownChildren.set(node, new VirtualMapNode(node));
			}
		}
	}

	public get names(): string[] {
		if (!this.containsSingleDirectory) {
			return [this.original.name];
		}

		return [this.original.name].concat(...this.realChildren![0].names);
	}

	public get path(): string | undefined {
		return this.original.path;
	}

	public get children(): VirtualMapNode[] | undefined {
		if (this.containsSingleDirectory) {
			return this.realChildren![0].children;
		}
		return this.realChildren;
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

	private get isDirectory(): boolean {
		return this.children !== undefined;
	}

	private get isRoot(): boolean {
		return this.original.name === '';
	}

	private get containsSingleDirectory(): boolean {
		const realChildren = this.realChildren;
		return realChildren !== undefined
			&& realChildren.length === 1
			&& realChildren[0].isDirectory
			&& !this.isRoot;
	}

	private get realChildren(): VirtualMapNode[] | undefined {
		if (!this.original.children) {
			return undefined;
		}

		return this.original.children
			.filter(n => n.displayed)
			.sort((a, b) => this.sort(a, b))
			.map(n => this.resolve(n));
	}

	private sort(a: MapNode, b: MapNode): number {
		const aIsDir = a.children !== undefined;
		const bIsDir = b.children !== undefined;

		if (aIsDir !== bIsDir) {
			return aIsDir ? 1 : -1;
		}

		return a.name.localeCompare(b.name);
	}
}
