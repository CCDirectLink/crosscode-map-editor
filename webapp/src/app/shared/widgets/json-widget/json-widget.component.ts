import {Component, Input, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {JsonEditorComponent} from '../../../components/json-editor/json-editor.component';
import {MatDialog} from '@angular/material';

@Component({
	selector: 'app-json-widget',
	templateUrl: './json-widget.component.html',
	styleUrls: ['./json-widget.component.scss', '../widget.scss']
})
export class JsonWidgetComponent extends AbstractWidget {
	
	@Input() noPropName = false;
	private timer;
	json = JSON;
	
	constructor(private dialog: MatDialog) {
		super();
	}
	
	openJsonEditor() {
		const ref = this.dialog.open(JsonEditorComponent, {
			data: {
				val: this.settings[this.key],
				key: this.key
			}
		});
		
		ref.afterClosed().subscribe(res => {
			if (res) {
				this.setCustomSetting(this.key, JSON.stringify(res));
			}
		});
	}
	
	setCustomSetting(key, value) {
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			value = JSON.parse(value);
			this.settings[key] = value;
			this.updateType();
		}, 500);
	}
}
