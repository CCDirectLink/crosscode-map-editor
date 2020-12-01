import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

const ANIMATION_TIMING = '300ms cubic-bezier(0.25, 0.8, 0.25, 1)';

/**
 * Shows a list that can be filtered.
 * Emits an event if an entry is selected
 *
 * Use with {@link OverlayService}.
 * height can be configured through the overlay config, width is fixed
 */
@Component({
	animations: [
		trigger('slideContent', [
			transition('* => slide', [
				style({
					transform: 'translate(80px, 0)',
					opacity: 0
				}),
				animate(ANIMATION_TIMING)
			]),
			
			state('scale', style({'transform-origin': '0 0 0'})),
			transition('* => scale', [
				style({
					'transform-origin': '0 0 0',
					transform: 'scale(0, 0)'
				}),
				animate(ANIMATION_TIMING)
			]),
		])
	],
	selector: 'app-list-search-overlay',
	templateUrl: './list-search-overlay.component.html',
	styleUrls: ['./list-search-overlay.component.scss']
})
export class ListSearchOverlayComponent implements OnInit {
	@ViewChild('filterInput', {static: true}) filterInput!: ElementRef<HTMLInputElement>;
	
	@Input() list: string[] = [];
	@Input() animation: 'slide' | 'scale' | 'none' = 'slide';
	@Output() selected = new EventEmitter<string>();
	
	currentIndex = 0;
	filteredList: string[] = [];
	
	private _filterText = ' ';
	
	get filterText() {
		return this._filterText;
	}
	
	set filterText(text) {
		if (text === this._filterText) {
			return;
		}
		
		this.currentIndex = 0;
		this._filterText = text;
		
		if (!text || !text.trim()) {
			this.filteredList = this.list;
			return;
		}
		text = text.trim();
		
		const searchStr = text.toLowerCase();
		this.filteredList = this.list.filter(text => {
			const compareStr = text.toLowerCase();
			return compareStr.includes(searchStr) || compareStr.replace('_', '').includes(searchStr);
		});
	}
	
	constructor() {
	}
	
	ngOnInit() {
		this.filterInput.nativeElement.focus();
		this.filterText = '';
	}
	
	select(item: string) {
		this.selected.emit(item);
	}
	
	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const item = this.filteredList[this.currentIndex];
			if (item) {
				this.select(item);
			}
			return;
		}
		
		if (event.key === 'ArrowDown') {
			this.currentIndex += 1;
			this.currentIndex %= this.filteredList.length;
		} else if (event.key === 'ArrowUp') {
			this.currentIndex -= 1;
			if (this.currentIndex < 0) {
				this.currentIndex += this.filteredList.length;
			}
		}
	}
}
