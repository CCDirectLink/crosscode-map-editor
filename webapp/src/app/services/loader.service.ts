import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { HttpService } from './http.service';
import { CCMap } from '../renderer/phaser/tilemap/cc-map';
import { CCMapLayer } from '../renderer/phaser/tilemap/cc-map-layer';

@Injectable()
export class LoaderService {
	public readonly map = new Observable<CrossCodeMap>(sub => this.mapSubscriber = sub);
	public readonly tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	public readonly selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);

	private mapSubscriber!: Subscriber<CrossCodeMap>;

	public constructor(
		private http: HttpService,
	) {
	}

	public async loadMapByName(name: string) {
		const map = await this.http.getMap(name).toPromise();
		this.loadRawMap(map, name);
	}

	public loadRawMap(map: CrossCodeMap, name?: string) {
		if (!map.mapHeight) {
			this.mapSubscriber.error(new Error('Invalid map'));
		}
		map.filename = name || 'Untitled';
		this.mapSubscriber.next(map);
	}
}
