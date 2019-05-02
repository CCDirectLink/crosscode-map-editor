import { Component, OnInit , Input} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {CharacterNamesService} from './character-names.service';

@Component({
  selector: 'app-character-widget',
  templateUrl: './character-widget.component.html',
  styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends AbstractWidget implements OnInit {

  /** @member {boolean} nested */
  @Input() nested: boolean = false;

  constructor(private namesService : CharacterNamesService) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Returns all known character names. 
   * @returns {string[]} Character names in the format of "typeOfCharacter.characterAlias"
   */
  getAllNames(): string[] {
    return this.namesService.getAll();
  }

}
