import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JsonEditorComponent } from '../../json-editor/json-editor.component';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-json-widget',
	templateUrl: './json-widget.component.html',
	styleUrls: ['./json-widget.component.scss', '../widget.scss'],
	standalone: false
})
export class JsonWidgetComponent extends AbstractWidget {
	
	@Input() noPropName = false;
	private timer = -1;
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
		
		ref.afterClosed().subscribe((res: any) => {
			if (res) {
				this.setCustomSetting(this.key, JSON.stringify(res));
			}
		});
	}
	
	setCustomSetting(key: string, value: any) {
		if (this.timer >= 0) {
			clearTimeout(this.timer);
		}
		this.timer = window.setTimeout(() => {
			value = JSON.parse(value);
			this.settings[key] = value;
			this.updateType(value);
		}, 500);
	}
}
