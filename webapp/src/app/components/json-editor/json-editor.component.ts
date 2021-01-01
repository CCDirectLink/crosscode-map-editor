import {AfterViewInit, Component, ElementRef, Inject, Optional, ViewChild} from '@angular/core';
import JSONEditor, {JSONEditorOptions} from 'jsoneditor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Globals} from '../../shared/globals';

@Component({
	selector: 'app-json-editor',
	templateUrl: './json-editor.component.html',
	styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements AfterViewInit {
	@ViewChild('editor', {static: false}) container?: ElementRef;
	
	private editor?: JSONEditor;
	private options: JSONEditorOptions = {};
	data: any;
	private key: string;
	json = JSON;
	
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: { key: string, val: any },
				public ref: MatDialogRef<JsonEditorComponent>) {
		this.data = data.val;
		this.key = data.key;
		ref.afterClosed().subscribe(() => {
			Globals.disablePhaserInput.delete('json');
		});
	}
	
	ngAfterViewInit() {
		Globals.disablePhaserInput.add('json');
		this.options = {};
		this.options.onChange = () => {
			if (!this.editor) {
				throw new Error('no editor defined');
			}
			this.data = this.editor.get();
		};
		if (!this.container) {
			throw new Error('could not find html element "editor"');
		}
		this.editor = new JSONEditor(this.container.nativeElement, this.options);
		this.editor.set(this.data);
		this.editor.setName(this.key);
		this.editor.expandAll();
	}
	
	setJson(val: string) {
		if (!this.editor) {
			throw new Error('no editor defined');
		}
		this.data = JSON.parse(val);
		this.editor.set(this.data);
		this.editor.expandAll();
	}
	
}
