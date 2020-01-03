import { Injectable } from '@angular/core';
import {Globals} from '../shared/globals';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {modloader} from 'cc-map-editor-common';

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
            this.http.get<any>(Globals.URL + 'modloader/load/json?path=' + encodeURI(relativePath)).toPromise();
        }

        return modloader.loadJson(relativePath);
    }

    changeAssetsPath(assetsPath: string): void {
        if (Globals.isElectron) {
            modloader.changeAssetsPath(assetsPath);
        }
    }

    getResourcePath(relativePath: string): Observable<string> {
        if (!Globals.isElectron) {
            this.http.get<string>(Globals.URL + 'modloader/resource?path=' + encodeURI(relativePath));

        }

        const resourcePath = modloader.getResourcePath(relativePath);
        return new Observable<string>(sub => sub.next(resourcePath));
    }

    getAllModsAssetsPath(): Observable<{name: string, path: string}[]> {
        if (!Globals.isElectron) {
            return this.http.get<{name: string, path: string}[]>(Globals.URL + 'modloader/mods/assets-path');
        }

        return new Observable<{name: string, path: string}[]>(subscriber => {
            subscriber.next(modloader.getAllModsAssetsPath());
        });
        
    }
}
