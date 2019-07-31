import { Component, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatSidenav } from '@angular/material';
import { HttpClientService } from '../../services/http-client.service';
import { MapLoaderService } from '../../shared/map-loader.service';
import { MapNode, MapNodeRoot } from './mapNode.model';
import { VirtualMapNode } from './virtualMapNode.model';


@Component({
	selector: 'app-load-map',
	templateUrl: './load-map.component.html',
	styleUrls: ['./load-map.component.scss']
})
export class LoadMapComponent {
	@Input()
	sidenav!: MatSidenav;

	treeControl = new NestedTreeControl<VirtualMapNode>(node => node.children);
	mapsSource = new MatTreeNestedDataSource<VirtualMapNode>();

	root: MapNodeRoot = {name: 'root', displayed: true, children: []}; // The root itself is never displayed. It is used as a datasource for virtualRoot.
	virtualRoot = new VirtualMapNode(this.root); // To reuse the children filtering. 
	filter = '';

	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService,
	) {
		this.mapsSource.data = [];
	}

	refresh() {
		this.http.getMaps().subscribe(paths => {
			this.displayMaps(paths);
		});
	}

	update() {
		for (const node of this.root.children) {
			this.filterNode(node, this.filter);
		}
		this.mapsSource.data = [];
		this.mapsSource.data = this.virtualRoot.children || [];
	}
	
	loadMap(event: Event) {
		this.mapLoader.loadMap(event);
	}

	load(name: string) {
		this.mapLoader.loadMapByName(name);
	}

	hasChild(_: number, node: VirtualMapNode) {
		return node.children !== undefined;
	}

	close() {
		return this.sidenav.close();
	}

	highlight(text: string) {
		text = this.encodeHTML(text);
		if (this.filter.length === 0) {
			return text;
		}

		return text.split(this.filter).join(`<span class="highlight">${this.filter}</span>`); // Replace all;
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
		

		if (!this.root.children) {
			throw new Error('Unreachable');
		}
		this.root.children = data;
		this.mapsSource.data = this.virtualRoot.children || [];
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
		if (node.name.includes(filter)) {
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

	private encodeHTML(text: string) {
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') ;
	}
}
