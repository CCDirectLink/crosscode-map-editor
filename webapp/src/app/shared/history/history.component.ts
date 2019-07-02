import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HistoryState, StateHistoryService} from './state-history.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
	
	@ViewChild('listContainer', {static: false}) list?: ElementRef;
	
	states: HistoryState[] = [];
	selected?: { state?: HistoryState };
	selectedIndex = 0;
	
	constructor(
		private stateHistory: StateHistoryService
	) {
		stateHistory.states.subscribe(states => {
			this.states = states;
			this.updateSelected(this.selected);
			setTimeout(() => {
				if (!this.list) {
					return;
				}
				const el = this.list.nativeElement;
				el.scrollTop = el.scrollHeight * 2;
			}, 0);
		});
		stateHistory.selectedState.subscribe(container => {
			this.updateSelected(container);
		});
	}
	
	ngOnInit() {
	}
	
	updateSelected(container?: { state?: HistoryState }) {
		if (!container) {
			return;
		}
		this.selected = container;
		this.selectedIndex = this.states.indexOf(container.state as any);
	}
	
	undo() {
		this.stateHistory.undo();
	}
	
	redo() {
		this.stateHistory.redo();
	}
	
	selectState(state: HistoryState) {
		this.stateHistory.selectedState.next({state: state});
	}
	
}
