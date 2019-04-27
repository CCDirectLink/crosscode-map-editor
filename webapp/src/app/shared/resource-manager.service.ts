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
    console.log(Globals.assetsFolders);
    Globals.assetsFolders.push(path);
  }
  public async loadImage(key) : Promise<any> {
    const game = Globals.game;
    if (game.cache.checkImageKey(key)) {
      return Promise.resolve();
    }
    
    console.log("Loading image", key);
    
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
    
    return Promise.reject(`Could not load ${key}`);
  }

  public loadJSON(key, path, callback) {

    if (key === "!") { 
      // this is a map
      // convert from full to relative path 
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

  public async generatePatch(path, mapObject) {
    
    console.log(path);

    let originalPath = this.getValidResourcePath(path);

    // @ts-ignore
    let original = JSON.parse(await this.getResource(originalPath));
    console.log("About to generate patch");
    console.log(original);
    console.log(mapObject);
    let patch = this._generatePatch(original,mapObject);
    console.log(patch);
    return patch;
  }
  private _generatePatch(original, modified) {
		const result = {};

		for (const key in modified) {
			if (modified[key] == undefined && original[key] == undefined) {
				continue;
			}
      if(typeof modified[key] === "number" && typeof original[key] === "string") {
        if (Number(original[key]) === Number(modified[key])) {
          continue;
        }
      }
			if (modified[key] == undefined && original.hasOwnProperty(key)) {
				result[key] = null;
			} else if (!original.hasOwnProperty(key) || original[key] === undefined || original[key].constructor !== modified[key].constructor) {
				result[key] = modified[key];
			} else if (original[key] !== modified[key]) {
				if (modified[key].constructor === Object || modified[key].constructor === Array) {
					const res = this._generatePatch(original[key], modified[key]);
					if(res !== undefined) {
						result[key] = res;
					}
        } else if (typeof modified[key] === "number" && (Number(original[key]) === Number(modified[key]))) {
          // layer properties sometimes have strings for numbers
          continue;
        } else {
					result[key] = modified[key];
				}
			}
		}

		for (const key in original) {
			if(modified[key] === undefined) {
				result[key] = null;
			}
		}

		for (const key in result) {
			if(result[key] && result[key].constructor === Function){
				result[key] = undefined;
				delete result[key];
			}
		}

		if (Object.keys(result).length == 0) {
			return undefined;
		} else {
			return result;
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
  
  public getRelativePath(path: string) : string {
    path = this.normalizePath(path);
    let assetsPath = this.getAssetsPath(path);
    return path.replace(assetsPath, "");
  }
}
