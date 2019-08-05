import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../renderer/globals';
import { CrossCodeMap } from '../models/cross-code-map';

@Injectable()
export class HttpService {
	public constructor(
		private http: HttpClient) {
	}


	public getMap(path: string): Observable<CrossCodeMap> {
		return this.http.get<CrossCodeMap>(`${Globals.URL}data/maps/${path.replace(/\./g, '/')}.json`);
	}
}
