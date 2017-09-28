import {Component, Input, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {JsonEditorComponent} from '../../../../shared/json-editor/json-editor.component';
import {MdDialog} from '@angular/material';

@Component({
	selector: 'app-json-widget',
	templateUrl: './json-widget.component.html',
	styleUrls: ['./json-widget.component.scss', '../../entities.component.scss']
})
export class JsonWidgetComponent extends AbstractWidget implements OnInit {
	
	@Input() custom;
	
	private timer;
	json = JSON;
	
	constructor(private dialog: MdDialog) {
		super();
	}
	
	ngOnInit() {
	}
	
	openJsonEditor() {
		const ref = this.dialog.open(JsonEditorComponent, {
			data: {
				val: this.custom ? this.custom[this.key] : this.entity.details.settings[this.key],
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
			if (this.custom) {
				this.custom[key] = value;
			} else {
				this.entity.details.settings[key] = value;
			}
			this.updateType();
		}, 500);
	}
}
