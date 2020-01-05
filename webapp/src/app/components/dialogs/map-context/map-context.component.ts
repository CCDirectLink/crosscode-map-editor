import { Component, OnInit, Inject } from '@angular/core';
import { MapContext } from '../../../models/cross-code-map';
import { GlobalEventsService } from '../../../shared/global-events.service';
import { ModloaderService } from '../../../services/modloader.service';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-map-context',
  templateUrl: './map-context.component.html',
  styleUrls: ['./map-context.component.scss']
})
export class MapContextComponent implements OnInit {

  mods: MapContext[] = []; 

  default: MapContext = {
    name: 'CrossCode',
    path: ''
  };

  selected: MapContext;
  constructor(
    private events: GlobalEventsService,
    private modloader: ModloaderService,
    private ref: MatDialogRef<MapContextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapContext) { 
      this.selected = data || this.default;
    }

  ngOnInit() {
    
    this.mods.push(this.default);
    this.initMods();
  }

  initMods() {
    this.mods.splice(1);

		this.modloader.getAllModsAssetsPath().subscribe((mods: MapContext[]) => this.mods.push(...mods));
  }


  onSelect(_: any, mod: MapContext) {
    this.selected = mod;
  }

  close() {
    this.ref.close();
  }

  save() {
    this.events.changeMapContext.next(this.selected);
    this.close();
  }
}
