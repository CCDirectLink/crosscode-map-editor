import { Injectable } from '@angular/core';
import {Globals} from '../shared/globals';
import {GenericModLoader, Mod} from '@ac2pic/modloader';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ModloaderService {
    
    private modloader: GenericModLoader | null;

    constructor(
        private http: HttpClient
    ) { 
        if (Globals.isElectron) {
            // @ts-ignore
            this.modloader = new (require('@ac2pic/modloader'));
        } else {
            this.modloader = null;
        }
    }

    loadJson(relativePath: string): Promise<any> {
        if (this.modloader) {
            return this.modloader.loadJson(relativePath);
        }
        return this.http.get<any>(Globals.URL + 'api/resource/load?path=' + encodeURI(relativePath)).toPromise();
    }

    changeAssetsPath(assetsPath: string): void {
        if (this.modloader) {
            this.modloader.setGamePath(assetsPath);
            this.modloader.loadMods();
        }
    }

    getResourcePath(relativePath: string): Observable<string> {
        if (this.modloader) {
            const resourcePath = this.modloader.getResourcePath(relativePath);
            return new Observable<string>(sub => sub.next(resourcePath));
        }
        return this.http.get<string>(Globals.URL + 'api/resource/path/?path=' + encodeURI(relativePath));
    }

    getAllModsAssetsPath(): Observable<{name: string, path: string}[]> {
        if (this.modloader) {
            const mods = this.modloader.getMods();
            const assetsMods: {name: string, path: string}[] = [];  
            for (const mod of mods) {
                if (mod.hasPath('data/maps')) {
                    assetsMods.push({name: mod.name, path: mod.resolveRelativePath('assets/')});
                }
            }
            return new Observable<{name: string, path: string}[]>(subscriber => {
                subscriber.next(assetsMods);
            });
        }

        return this.http.get<{name: string, path: string}[]>(Globals.URL + 'api/mods/assets/path');
    }
}
