import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { PropListCard } from './image-select-card/image-select-card.component';

export interface PropListGroup {
	title?: string;
	props: PropListCard[];
	selected?: string;
	click?: (val: string) => void;
}

@Component({
	selector: 'app-image-select-overlay',
	templateUrl: './image-select-overlay.component.html',
	styleUrls: ['./image-select-overlay.component.scss']
})
export class ImageSelectOverlayComponent implements OnChanges, OnDestroy {
	
	@Input() splitBaseName = ImageSelectOverlayComponent.name;
	@Input() splitBase = 13;
	@Input() title = '';
	@Input() showGlobalCheckbox = false;
	@Input() loading = true;
	
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
