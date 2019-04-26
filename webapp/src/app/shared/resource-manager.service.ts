import { Injectable } from '@angular/core';
import {MapLoaderService} from './map-loader.service';
import {Globals} from './globals';
import {Subscription} from 'rxjs';
import {Remote, Dialog} from 'electron';
import {} from 'pixi';

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
  constructor(private mapLoader: MapLoaderService) {
    if(Globals.isElectron) {
      Globals.resourceManager = this;
      // @ts-ignore
      this.remote = window.require('electron').remote;
      this.fs = this.remote.require('fs');

      this.mapSubscription = this.mapLoader.map.subscribe((map) => {
        if(!map || !map.path) {
          return;
        }
        if(Globals.assetsFolders.length > 1) {
          Globals.assetsFolders.pop();
        }
        const normalizedPath: string = this.normalizePath(map.path);
        
        const path: string = this.getAssetsPath(normalizedPath);
        
        Globals.assetsFolders.push(path);
      });
    }
    
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
    this._loadJSON(key, path, callback);
  }
  private _loadJSON(key: string, relativePath: string, callback: any, isHighest = false) {
    if (this.cache['json'][key]) {
      callback(this.cache['json'][key]);
      return;
    }
    this.loadResource(relativePath).then((data : string) => {
      const jsonData = JSON.parse(data);
      this.cache['json'][key] = jsonData;
      console.log(`Successfully loaded ${key}`);
      callback(jsonData);
    });
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
}
