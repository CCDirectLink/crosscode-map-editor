import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Globals} from '../renderer/globals';

export interface HistoryStateContainer {
	state?: HistoryState;
}

export interface HistoryState {
	icon: string;
	name: string;
	json: string;
}

@Injectable()
export class StateHistoryService {
	maxStates = 100;
	
	states = new BehaviorSubject<HistoryState[]>([]);
	selectedState = new BehaviorSubject<HistoryStateContainer>({state: undefined});
	
	constructor() {
	}
	
	init(state: HistoryState) {
		this.selectedState.value.state = state;
		this.states.next([state]);
	}
	
	saveState(state: {
		icon: string;
		name: string;
		json?: string;
	}, ignoreCheck = false) {
		if (!state.json) {
			const newState = Globals.map.exportMap();
			const stateJson = JSON.stringify(newState);
			if (!ignoreCheck) {
				const val = this.selectedState.getValue();
				if (val.state && val.state.json === stateJson) {
					return;
				}
			}
			state.json = stateJson;
		}
		
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		const i = states.indexOf(selected.state!);
		selected.state = state as HistoryState;
		states.length = i + 1;
		if (states.length >= this.maxStates) {
			states.shift();
		}
		states.push(selected.state);
		this.states.next(states);
	}
	
	undo() {
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		let i = states.indexOf(selected.state!);
		if (i <= 0) {
			return;
		}
		i--;
		this.selectedState.next({state: states[i]});
	}
	
	redo() {
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		let i = states.indexOf(selected.state!);
		if (i === states.length - 1) {
			return;
		}
		i++;
		this.selectedState.next({state: states[i]});
	}
}
