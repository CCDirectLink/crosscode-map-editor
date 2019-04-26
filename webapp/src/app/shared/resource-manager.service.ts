import { Injectable } from '@angular/core';
import {MapLoaderService} from './map-loader.service';
import {Globals} from './globals';
import {Subscription} from 'rxjs';
import {Remote, Dialog} from 'electron';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ResourceManagerService {
  mapSubscription : Subscription;
  private cache: any = {
    json : {},
    image : {}
  };
  private readonly remote: Remote;
  private fs;
  private path;
  constructor(private mapLoader: MapLoaderService) {
    if(Globals.isElectron) {
      Globals.resourceManager = this;
      // @ts-ignore
      this.remote = window.require('electron').remote;
      this.fs = this.remote.require('fs');
      // @ts-ignore
      this.path = window.require('path');
    }
    
  }
  public addAssetsPath(mapAssetsPath : string) {
    if(Globals.assetsFolders.length > 1) {
      Globals.assetsFolders.pop();
    }
    const normalizedPath: string = this.normalizePath(mapAssetsPath);
    
    const path: string = this.getAssetsPath(normalizedPath);
    
    Globals.assetsFolders.push(path);
  }
  public async loadImage(key, cb = () => {}) : Promise<any> {
    let resourcePath = this.getValidResourcePath(key);
    if(resourcePath) {
      return new Promise((resolve, reject) => {
        const game = Globals.game;
        game.load.image(key, resourcePath);
        game.load.onLoadComplete.addOnce(() => {
          resolve();
        });
        game.load.start();
      })
    }
    console.log('Could not load...', key);
    return Promise.reject(`Could not load ${key}`);
  }

  public loadJSON(key, path, callback) {
    // it is a map file

    if (key === "!") { 
      // convert from full to relative path
      path = this.normalizePath(path);
      let relativePath = this.getRelativePath(path);
      this._loadJSON("!", relativePath, callback, true);
    } else {
      this._loadJSON(key, path, callback);
    }
    
  }
  private _loadJSON(key: string, relativePath: string, callback: any, ignoreCache: boolean = false) {
    if (!ignoreCache && this.cache['json'][key]) {
      callback(this.cache['json'][key]);
      return;
    }

    this.loadResource(relativePath).then((data : string) => {
      const jsonData = JSON.parse(data);

      console.log(`Successfully loaded ${key}`);
      
      return jsonData;
    }).then(async (jsonData) => {
      let resourcePatchPath = this.getValidResourcePath(relativePath + '.patch');
      console.log(relativePath + '.patch', resourcePatchPath);
      if (resourcePatchPath) {
        console.log("Resource had patches...applying");
        
        let patchJSON: any = await this.getResource(resourcePatchPath);
        patchJSON = JSON.parse(patchJSON);

        this.applyPatch(jsonData, patchJSON);
      }
      
      if(!ignoreCache) {
        this.cache['json'][key] = jsonData;
      }
      
      callback(jsonData);

    });
  }

  // https://github.com/CCDirectLink/CCLoader/blob/master/assets/mods/simplify/mod.js (line: 1050)
	private applyPatch(obj, patch) {
		for (const key in patch){
			if(obj[key] === undefined)
				obj[key] = patch[key];
			else if(patch[key] === undefined)
				obj[key] = undefined;
			else if(patch[key].constructor === Object)
				this.applyPatch(obj[key], patch[key]);
			else
				obj[key] = patch[key];
		}
  }
  
  private getValidResourcePath(relativePath, searchIndex = 0) {
    if (searchIndex >= Globals.assetsFolders.length) {
      return null;
    }
    const fullPath = Globals.assetsFolders[searchIndex] + relativePath;
    const exists = this.fs.existsSync(fullPath);
    if (exists) {
      return fullPath;
    }
    return this.getValidResourcePath(relativePath, searchIndex + 1);
  }

  private async loadResource(relativePath: string) {
    let resourcePath = this.getValidResourcePath(relativePath);
    if (!resourcePath) {
      return Promise.reject(`Could not load ${relativePath}`);
    }
    return this.getResource(resourcePath);
  }
  
  private getResource(path: string) {
    return new Promise((resolve, reject) => {
      this.fs.readFile(path,"utf8",(error, data) => {
          if(error) {
            console.log(path);
            console.log(error);
            reject(Promise.reject(error));
          }
          
          resolve(Promise.resolve(data));
      })
    });
  }

  private normalizePath(path: string) : string {
    return path.split("\\").join("/");
  }

  private getAssetsPath(path: string): string {
      
      // return everything including lastIndexOf /assets/
      let index = path.lastIndexOf('/assets/');
      if(index > -1) {
        index += '/assets/'.length;
        return path.substring(0, index);
      }
      return path;
  }
  
  private getRelativePath(path: string) : string {
    let assetsPath = this.getAssetsPath(path);
    return path.replace(assetsPath, "");
  }
}
