import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class LoaderService {
	private mapSubject = new BehaviorSubject<CrossCodeMap | undefined>(undefined);

	public readonly map = this.mapSubject.asObservable();

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
			this.mapSubject.error(new Error('Invalid map'));
		}
		map.filename = name || 'Untitled';
		this.mapSubject.next(map);
	}
}
