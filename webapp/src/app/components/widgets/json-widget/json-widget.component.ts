import { Component, inject, Input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JsonEditorComponent } from '../../json-editor/json-editor.component';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Helper } from '../../../services/phaser/helper';

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
	
	rows = signal(1);
	
	override ngOnInit() {
		super.ngOnInit();
		this.updateRows();
	}
	
	private updateRows(newVal?: string) {
		const setting = this.getJsonVal(newVal);
		const rows = setting?.split('\n').length ?? 1;
		this.rows.set(Helper.clamp(rows, 1, 5));
	}
	
	getJsonVal(newVal?: string) {
		return JSON.stringify(newVal ?? this.settings[this.key], null, 2);
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
		
		// scales textarea when copy pasting into empty field
		try {
			const newVal = JSON.parse(value);
			const prev = this.settings[key];
			if (!prev && newVal) {
				this.updateRows(newVal);
			}
		} catch (e) {}
		
		this.timer = window.setTimeout(() => {
			value = JSON.parse(value);
			this.settings[key] = value;
			this.updateType(value);
		}, 500);
	}
	
}
