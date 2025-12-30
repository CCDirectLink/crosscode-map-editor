import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ImageSelectCardComponent, PropListCard } from './image-select-card/image-select-card.component';
import { OverlayPanelComponent } from '../../../dialogs/overlay/overlay-panel/overlay-panel.component';
import { AutocompletedTextboxComponent } from '../../string-widget/autocompleted-textbox/autocompleted-textbox.component';
import { SplitPaneComponent } from '../../../split-pane/split-pane.component';
import { ImageSelectListComponent } from './image-select-list/image-select-list.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';

export interface PropListGroup {
	title?: string;
	props: PropListCard[];
	selected?: string;
	click?: (val: string) => void;
}

@Component({
	selector: 'app-image-select-overlay',
	templateUrl: './image-select-overlay.component.html',
	styleUrls: ['./image-select-overlay.component.scss'],
	imports: [
		OverlayPanelComponent,
		AutocompletedTextboxComponent,
		SplitPaneComponent,
		ImageSelectListComponent,
		MatFormField,
		MatLabel,
		MatInput,
		FormsModule,
		MatCheckbox,
		MatProgressSpinner,
		ImageSelectCardComponent,
		MatButton
	]
})
export class ImageSelectOverlayComponent implements OnChanges, OnDestroy {
	
	@Input() splitBaseName = ImageSelectOverlayComponent.name;
	@Input() splitBase = 13;
	@Input() title = '';
	@Input() showGlobalCheckbox = false;
	@Input() loading = false;
	
	// input for manual value enter
	@Input() manualKey?: string;
	@Input() manualValue?: string;
	@Output() manualValueChange = new EventEmitter<string>();
	
	@Input() sheets: string[] = [];
	@Input() sheet?: string;
	@Output() sheetChange = new EventEmitter<string>();
	
	@Input() leftGroup: PropListGroup = {props: []};
	
	@Input() showRightProps = true;
	@Input() rightGroups: PropListGroup[] = [];
	
	@Input() showPreview = false;
	@Input() preview?: string;
	
	@Input() global = false;
	@Output() globalChange = new EventEmitter<boolean>();
	
	@Output() exit = new EventEmitter<void>();
	
	filter = '';
	
	ngOnChanges(changes: SimpleChanges) {
		const key: keyof ImageSelectOverlayComponent = 'splitBaseName';
		if (!changes[key].currentValue) {
			return;
		}
		try {
			this.splitBase = parseFloat(localStorage.getItem(this.splitBaseName)!) ?? this.splitBase;
		} catch (e) {
			console.error(e);
		}
	}
	
	ngOnDestroy() {
		localStorage.setItem(this.splitBaseName, this.splitBase.toString());
	}
	
	close() {
		this.exit.emit();
	}
	
	
}
