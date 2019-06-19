import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, Optional, ViewChild} from '@angular/core';
import JSONEditor, {JSONEditorOptions} from 'jsoneditor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Globals} from '../../shared/globals';

@Component({
	selector: 'app-json-editor',
	templateUrl: './json-editor.component.html',
	styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements AfterViewInit {
	@ViewChild('editor', { static: false }) container: ElementRef;
	
	private editor: JSONEditor;
	private options: JSONEditorOptions;
	data;
	private key: string;
	json = JSON;
	
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) data,
	            public ref: MatDialogRef<JsonEditorComponent>) {
		this.data = data.val;
		this.key = data.key;
		ref.afterClosed().subscribe(() => {
			Globals.disablePhaserInput = false;
		});
	}
	
	ngAfterViewInit() {
		Globals.disablePhaserInput = true;
		this.options = {};
		this.options.onChange = () => {
			this.data = this.editor.get();
		};
		this.editor = new JSONEditor(this.container.nativeElement, this.options);
		this.editor.set(this.data);
		this.editor.setName(this.key);
		this.editor.expandAll();
	}
	
	setJson(val) {
		this.data = JSON.parse(val);
		this.editor.set(this.data);
		this.editor.expandAll();
	}
	
}
