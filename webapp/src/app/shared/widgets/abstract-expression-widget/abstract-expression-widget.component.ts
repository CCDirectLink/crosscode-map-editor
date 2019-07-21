import { Component, Input, OnInit } from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
  selector: 'app-abstract-expression-widget',
  templateUrl: './abstract-expression-widget.component.html',
  styleUrls: ['./abstract-expression-widget.component.scss']
})
export class AbstractExpressionWidget extends AbstractWidget implements OnInit {
	valueType: string = 'value';
	
	oncontextmenu() {
		// this should show the custom context menu;

		return false;
	}


	setSetting(key: string, value: any, updateType = true, parse = false) {
		if (this.valueType === 'varName') {
			super.setSetting(key, {
				varName: value
			});
		} else if (this.valueType === 'indirect') {
			super.setSetting(key, {
				indirect: value
			});
		} else {
			super.setSetting(key, value, updateType, parse);
		}
	}
}
