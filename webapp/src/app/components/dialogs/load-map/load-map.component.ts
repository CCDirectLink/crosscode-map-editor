import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, Input, resource, untracked, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatNestedTreeNode, MatTree, MatTreeNestedDataSource, MatTreeNode, MatTreeNodeDef, MatTreeNodeOutlet, MatTreeNodeToggle } from '@angular/material/tree';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AssetFile, AssetsAccessService } from '../../../services/assets-access.service';
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
		MatNestedTreeNode,
		MatTreeNodeToggle,
		MatTreeNodeOutlet,
		MatProgressSpinner,
	
	],
})
export class LoadMapComponent {
	private mapLoader = inject(MapLoaderService);
	private assets = inject(AssetsAccessService);
	private ref = inject(ChangeDetectorRef);
	private searchFilterService = inject(SearchFilterService);
	
	
	@ViewChild('fileUpload', { static: true })
	fileUpload!: ElementRef<HTMLInputElement>;
	
	@ViewChild('filterInput', { static: true })
	filterInput!: ElementRef<HTMLInputElement>;
	
	@Input()
	sidenav!: MatSidenav;

	maps = resource({
		params: () => this.assets.handle(),
		loader: () => this.assets.getAllMaps(),
	});

	treeControl = new NestedTreeControl<VirtualMapNode>(node => node.children);
	mapsSource = new MatTreeNestedDataSource<VirtualMapNode>();
	
	root: MapNodeRoot = { name: '', displayed: true, children: [] }; // The root itself is never displayed. It is used as a datasource for virtualRoot.
	virtualRoot = new VirtualMapNode(this.root); // To reuse the children filtering.
	filter = '';
	
	constructor() {
		this.mapsSource.data = [];

		effect(() => {
			const maps = this.maps.value();
			if (!maps) {
				return;
			}
			untracked(() => {
				this.displayMaps(maps);
				this.update();
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
		this.mapsSource.data = [];
		this.mapsSource.data = this.virtualRoot.children || [];
		this.ref.markForCheck();
	}
	
	async loadMap(event: Event) {
		this.mapLoader.loadMap(event, true);
		this.fileUpload.nativeElement.value = '';
	}
	
	async load(file: AssetFile) {
		await this.mapLoader.loadMapByFile(file, true);
	}
	
	hasChild(_: number, node: VirtualMapNode) {
		return node.children !== undefined;
	}
	
	close() {
		return this.sidenav.close();
	}
	
	private displayMaps(files: AssetFile[]) {
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
		
		this.root.children = data;
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
		if (this.searchFilterService.test(node.name, filter)) {
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
