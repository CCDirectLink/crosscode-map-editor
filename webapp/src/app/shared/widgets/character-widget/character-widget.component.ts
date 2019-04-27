import { Component, OnInit } from '@angular/core';
import {Globals} from '../../globals';
import {AbstractWidget} from '../abstract-widget';

@Component({
  selector: 'app-character-widget',
  templateUrl: './character-widget.component.html',
  styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends AbstractWidget implements OnInit {

  constructor() { 
    super();
    if(CharacterNamesManager.hasNoNames()) {
      CharacterNamesManager.init();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this);
  }
  getAllNames() {
    return CharacterNamesManager.names;
  }

}


class CharacterNamesManager {
  static names = [];
  static path;
  static fs;
  static init() {
    console.log("Initializing");
    if(Globals.isElectron) {
      // @ts-ignore
      this.fs = window.require('fs');
      // @ts-ignore
      this.path = window.require('path');
      console.log(this, CharacterNamesManager);
      this.getAllCharacterNames();
    }

  }
  static hasNoNames() {
    return this.names.length === 0;
  }
  private static _getAllJsonFiles(dir, files) {
    let dirFiles = this.fs.readdirSync(dir);
    dirFiles.forEach((file) => {
      let fullPath = this.path.join(dir, file);
      if(this.fs.lstatSync(fullPath).isDirectory()) {
        this._getAllJsonFiles(fullPath, files);
      } else if(file.endsWith(".json")) {
        files.push(this.path.join(dir,file.substring(0, file.length - 5)));
      }
    });
  }
  
  private static getAllCharacterFiles(assetPaths) {
    let baseDirectory = this.path.join(assetPaths, 'data/characters/');
    let foundFiles = [];
    this._getAllJsonFiles(baseDirectory,foundFiles);
    
    return foundFiles.map((e) => e.replace(baseDirectory, "")
                          .split(this.path.sep).join("."));
  }
  
  public static getAllCharacterNames() {
    Globals.assetsFolders.forEach((path) => {
      this.names.push.apply(this.names, this.getAllCharacterFiles(path));
    });
  }
}