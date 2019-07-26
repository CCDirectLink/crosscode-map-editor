import { Component, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatSidenav } from '@angular/material';
import { HttpClientService } from '../../services/http-client.service';
import { MapLoaderService } from '../../shared/map-loader.service';

interface MapNode {
	name: string;
	path?: string;
	children?: MapNode[];
}

@Component({
	selector: 'app-load-map',
	templateUrl: './load-map.component.html',
	styleUrls: ['./load-map.component.scss']
})
export class LoadMapComponent {
	@Input()
	sidenav!: MatSidenav;

	treeControl = new NestedTreeControl<MapNode>(node => node.children);
	mapsSource = new MatTreeNestedDataSource<MapNode>();

	filter = '';
	paths: string[] = [];

	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService,
	) {
		this.mapsSource.data = [];
	}

	refresh() {
		this.http.getMaps().subscribe(paths => {
			this.paths = paths;
			this.update();
		});
	}

	update() {
		this.displayMaps(this.paths, this.filter);
	}
	
	loadMap(event: Event) {
		this.mapLoader.loadMap(event);
	}

	load(name: string) {
		this.mapLoader.loadMapByName(name);
	}

	hasChild(_: number, node: MapNode) {
		return !!node.children && node.children.length > 0;
	}

	close() {
		return this.sidenav.close();
	}

	private displayMaps(paths: string[], filter: string) {
		const data: MapNode[] = [];

		filter = filter.toLowerCase();
		paths = paths.filter(p => p.toLowerCase().includes(filter));

		let lastPath = '';
		let lastNode = data;
		for (const path of paths) {
			const node = this.resolve(data, path, lastNode, lastPath);
			const name = path.substr(path.lastIndexOf('.') + 1);

			node.push({name, path});

			lastPath = path;
			lastNode = node;
		}
		

		this.mapsSource.data = data;
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
				};
				node.push(newNode);
				node = children;
			}
		}
		return node;
	}
}
