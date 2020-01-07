import { Injectable } from '@angular/core';
import {Globals} from '../shared/globals';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {modloader} from 'cc-map-editor-common';
import {MapContext} from '../models/cross-code-map';

@Injectable({
    providedIn: 'root'
})
export class ModloaderService {

    constructor(
        private http: HttpClient
    ) { 
    }

    loadJson(relativePath: string): Promise<any> {
        if (!Globals.isElectron) {
            return this.http.get<any>(Globals.URL + 'api/load/json?path=' + encodeURI(relativePath)).toPromise();
        }

        return modloader.loadJson(relativePath);
    }

    changeAssetsPath(assetsPath: string): void {
        if (Globals.isElectron) {
            modloader.changeAssetsPath(assetsPath);
        }
    }

    getResourcePath(relativePath: string): Promise<string> {
        if (!Globals.isElectron) {
            return this.http.get<string>(Globals.URL + 'api/resourcePath?path=' + encodeURI(relativePath)).toPromise();
        }

        const resourcePath = modloader.getResourcePath(relativePath);
        return Promise.resolve(resourcePath);
    }

    getAllModsAssetsPath(): Observable<MapContext[]> {
        if (!Globals.isElectron) {
            return this.http.get<MapContext[]>(Globals.URL + 'api/mods');
        }

        return new Observable<MapContext[]>(subscriber => {
            subscriber.next(modloader.getAllModsAssetsPath());
        });
        
    }
}
