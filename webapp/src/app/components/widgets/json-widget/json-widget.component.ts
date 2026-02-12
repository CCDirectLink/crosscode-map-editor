import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JsonEditorComponent } from '../../json-editor/json-editor.component';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-json-widget',
    templateUrl: './json-widget.component.html',
    styleUrls: ['./json-widget.component.scss', '../widget.scss'],
    imports: [FlexModule, MatTooltip, FormsModule]
})
export class JsonWidgetComponent extends AbstractWidget {
	private dialog = inject(MatDialog);

	
	@Input() noPropName = false;
	private timer = -1;
	json = JSON;
	
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
