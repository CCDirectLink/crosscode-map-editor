import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, Input, resource, signal, untracked, ViewChild, viewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodeToggle } from '@angular/material/tree';
import { MapLoaderService } from '../../../services/map-loader.service';
import { SearchFilterService } from '../../../services/search-filter.service';
import { MapNode, MapNodeRoot } from './mapNode.model';
import { VirtualMapNode } from './virtualMapNode.model';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { ColoredTextDirective } from '../../../directives/colored-text.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AssetFile, AssetsAccessService, ModInfo } from '../../../services/assets-access.service';
import { BasePath, FileExtension } from '../../../services/path-resolver';


@Component({
	selector: 'app-load-map',
	templateUrl: './load-map.component.html',
	styleUrls: ['./load-map.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatToolbar,
		MatIconButton,
		MatIcon,
		MatFormField,
		MatInput,
		FormsModule,
		MatTree,
		MatTreeNodeDef,
		MatTreeNode,
		MatButton,
		HighlightDirective,
		ColoredTextDirective,
		MatTreeNodeToggle,
		MatProgressSpinner,
	
	],
})
export class LoadMapComponent {
	private mapLoader = inject(MapLoaderService);
	private assets = inject(AssetsAccessService);
	private ref = inject(ChangeDetectorRef);
	private searchFilterService = inject(SearchFilterService);
	
	
	@ViewChild('filterInput', { static: true })
	filterInput!: ElementRef<HTMLInputElement>;
	
	@Input()
	sidenav!: MatSidenav;

	maps = resource({
		params: () => this.assets.accessibleHandle(),
		loader: () => this.assets.getAllMaps(),
	});

	nodes: VirtualMapNode[] = [];
	childrenAccessor = (node: VirtualMapNode) => node.children ?? [];
	private matTree = viewChild<MatTree<VirtualMapNode>>(MatTree);
	private sections = signal<VirtualMapNode[]>([]);
	
	root: MapNodeRoot = { name: '', displayed: true, children: [] }; // The root itself is never displayed. It is used as a datasource for virtualRoot.
	virtualRoot = new VirtualMapNode(this.root); // To reuse the children filtering.
	filter = '';
	
	constructor() {
		effect(() => {
			if (!this.maps.hasValue()) {
				return;
			}
			const maps = this.maps.value();
			untracked(() => {
				this.displayMaps(maps);
				this.update();
			});
		});
		
		// sections start expanded
		effect(() => {
			const tree = this.matTree();
			const sections = this.sections();
			untracked(() => {
				for (const section of sections) {
					tree?.expand(section);
				}
			});
		});
	}
	
	focusInput() {
		this.filterInput.nativeElement.focus();
	}
	
	update() {
		for (const node of this.root.children) {
			this.filterNode(node, this.filter);
		}
		this.virtualRoot.refresh();
		this.nodes = this.virtualRoot.children ?? [];
		this.ref.markForCheck();
	}
	
	async openMap() {
		await this.mapLoader.openMap(true);
	}

	async load(file: AssetFile) {
		await this.mapLoader.loadMapByFile(file.handle, true);
	}
	
	hasChild(_: number, node: VirtualMapNode) {
		return node.children !== undefined;
	}
	
	isSection(_: number, node: VirtualMapNode) {
		return node.section;
	}
	
	close() {
		return this.sidenav.close();
	}
	
	private displayMaps(files: AssetFile[]) {
		const sources = new Map<ModInfo | undefined, AssetFile[]>();
		for (const file of files) {
			const sourceFiles = sources.get(file.mod);
			if (sourceFiles) {
				sourceFiles.push(file);
			} else {
				sources.set(file.mod, [file]);
			}
		}
		
		this.root.children = Array.from(sources).map(([mod, sourceFiles]) => ({
			name: mod?.displayName ?? 'CrossCode',
			section: true,
			displayed: true,
			children: this.buildTree(sourceFiles),
		}));
		
		this.virtualRoot.refresh();
		this.sections.set(this.virtualRoot.children ?? []);
	}
	
	private buildTree(files: AssetFile[]): MapNode[] {
		const data: MapNode[] = [];
		
		let lastPath = '';
		let lastNode = data;
		for (const file of files) {
			const path = file.path.substring(BasePath.MAPS.length, file.path.length - FileExtension.JSON.length);
			const node = this.resolve(data, path, lastNode, lastPath);
			const name = path.substring(path.lastIndexOf('/') + 1);
			
			node.push({ name, file, displayed: true });
			
			lastPath = path;
			lastNode = node;
		}
		
		return data;
	}
	
	private resolve(data: MapNode[], path: string, lastNode: MapNode[], lastPath: string): MapNode[] {
		if (path.substring(0, path.lastIndexOf('/')) === lastPath.substring(0, lastPath.lastIndexOf('/'))) {
			return lastNode;
		}
		
		if (!path.includes('/')) {
			return data;
		}
		
		let node = data;
		
		const parts = path
			.substring(0, path.lastIndexOf('/'))
			.split('/');
		for (const name of parts) {
			const child = node.find(n => n.name === name);
			if (child && child.children) {
				node = child.children;
			} else {
				const children: MapNode[] = [];
				const newNode: MapNode = {
					name: name,
					children: children,
					displayed: true,
				};
				node.push(newNode);
				node = children;
			}
		}
		return node;
	}
	
	private filterNode(node: MapNode, filter: string): boolean {
		if (!node.section && this.searchFilterService.test(node.name, filter)) {
			node.displayed = true;
			this.displayChildren(node);
			return true;
		}
		
		if (!node.children) {
			node.displayed = false;
			return false;
		}
		
		let displayed = false;
		for (const child of node.children) {
			if (this.filterNode(child, filter)) {
				displayed = true;
			}
		}
		
		node.displayed = displayed;
		return displayed;
	}
	
	private displayChildren(node: MapNode) {
		if (!node.children) {
			return;
		}
		
		for (const child of node.children) {
			child.displayed = true;
			this.displayChildren(child);
		}
	}
}
