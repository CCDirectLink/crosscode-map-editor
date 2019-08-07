import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { SettingsService } from './settings.service';

@Injectable()
export class HttpService {
	public constructor(
		private readonly http: HttpClient,
		private readonly settings: SettingsService,
	) {
	}


	public getMap(path: string): Observable<CrossCodeMap> {
		return this.http.get<CrossCodeMap>(`${this.settings.URL}data/maps/${path.replace(/\./g, '/')}.json`);
	}
}
