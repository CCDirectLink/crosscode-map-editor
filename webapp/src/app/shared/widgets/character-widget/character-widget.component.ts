import { Component, OnInit , Input} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {CharacterNamesService} from './character-names.service';

@Component({
  	selector: 'app-character-widget',
  	templateUrl: './character-widget.component.html',
  	styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends AbstractWidget implements OnInit {
  	@Input() nested = false;
  	names: string[];
  	constructor(private namesService: CharacterNamesService) { 
    	super();
  	}

  	ngOnInit() {
    	super.ngOnInit();
    	this.names = this.namesService.getAllNames();
  	}
}
