import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { firstValueFrom } from 'rxjs';
import { GlobalEventsService } from '../../../services/global-events.service';
import { HttpClientService } from '../../../services/http-client.service';
import { MapLoaderService } from '../../../services/map-loader.service';
import { SearchFilterService } from '../../../services/search-filter.service';
import { ConfirmCloseComponent } from '../confirm-close/confirm-close.component';
import { OverlayService } from '../overlay/overlay.service';
import { MapNode, MapNodeRoot } from './mapNode.model';
import { VirtualMapNode } from './virtualMapNode.model';


@Component({
	selector: 'app-load-map',
	templateUrl: './load-map.component.html',
	styleUrls: ['./load-map.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadMapComponent {
	
	@ViewChild('fileUpload', {static: true})
		fileUpload!: ElementRef<HTMLInputElement>;
	
	@ViewChild('filterInput', {static: true})
		filterInput!: ElementRef<HTMLInputElement>;
	
	@Input()
		sidenav!: MatSidenav;
	
	loading = false;
	
	treeControl = new NestedTreeControl<VirtualMapNode>(node => node.children);
	mapsSource = new MatTreeNestedDataSource<VirtualMapNode>();
	
	root: MapNodeRoot = {name: '', displayed: true, children: []}; // The root itself is never displayed. It is used as a datasource for virtualRoot.
	virtualRoot = new VirtualMapNode(this.root); // To reuse the children filtering.
	filter = '';
	
	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService,
		private ref: ChangeDetectorRef,
		private searchFilterService: SearchFilterService,
		private readonly eventsService: GlobalEventsService,
		private readonly overlayService: OverlayService
	) {
		this.mapsSource.data = [];
		this.refresh();
	}
	
	focusInput() {
		this.filterInput.nativeElement.focus();
	}
	
	refresh() {
		this.loading = true;
		this.http.getMaps().subscribe(paths => {
			this.loading = false;
			this.displayMaps(paths);
			this.update();
		});
	}
	
	update() {
		for (const node of this.root.children) {
			this.filterNode(node, this.filter);
		}
		this.mapsSource.data = [];
		this.mapsSource.data = this.virtualRoot.children || [];
		this.ref.detectChanges();
	}

	private async showConfirmDialog() {
		const hasUnsavedChanges = await firstValueFrom(this.eventsService.hasUnsavedChanges);
		if (!hasUnsavedChanges) {
			return true;
		}

		const dialogRef = this.overlayService.open(ConfirmCloseComponent, {
			hasBackdrop: true,
		});
		const result = await firstValueFrom(dialogRef.ref.onClose, {defaultValue: false});
		if (result) {
			this.eventsService.hasUnsavedChanges.next(false);
		}
		return result;
	}
	
	async loadMap(event: Event) {
		if (!await this.showConfirmDialog()) {
			return;
		}
		this.mapLoader.loadMap(event);
		this.fileUpload.nativeElement.value = '';
	}
	
	async load(name: string) {
		if (!await this.showConfirmDialog()) {
			return;
		}
		this.mapLoader.loadMapByName(name);
	}
	
	hasChild(_: number, node: VirtualMapNode) {
		return node.children !== undefined;
	}
	
	close() {
		return this.sidenav.close();
	}
	
	private displayMaps(paths: string[]) {
		const data: MapNode[] = [];
		
		let lastPath = '';
		let lastNode = data;
		for (const path of paths) {
			const node = this.resolve(data, path, lastNode, lastPath);
			const name = path.substr(path.lastIndexOf('.') + 1);
			
			node.push({name, path, displayed: true});
			
			lastPath = path;
			lastNode = node;
		}
		
		this.root.children = data;
	}
	
	private resolve(data: MapNode[], path: string, lastNode: MapNode[], lastPath: string): MapNode[] {
		if (path.substr(0, path.lastIndexOf('.')) === lastPath.substr(0, lastPath.lastIndexOf('.'))) {
			return lastNode;
		}
		
		if (!path.includes('.')) {
			return data;
		}
		
		let node = data;
		
		const parts = path
			.substr(0, path.lastIndexOf('.'))
			.split('.');
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
