import { Component, OnInit , Input} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
  selector: 'app-character-widget',
  templateUrl: './character-widget.component.html',
  styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends AbstractWidget implements OnInit {

  /** @member {boolean} nested */
  @Input() nested: boolean = false;
  constructor() { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Returns all known character names. 
   * @todo Implement class to manage character names.
   * @todo Remove hardcoded example output.
   * @returns {string[]} Character names in the format of "typeOfCharacter.characterAlias"
   */
  getAllNames(): string[] {
    return ["main.lea"];
  }

}
