import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AbstractEvent, EventType } from '../event-registry/abstract-event';
import { EventRegistryService } from '../event-registry/event-registry.service';

@Injectable({
	providedIn: 'root'
})
export class EventHelperService {
	
	selectedEvent: BehaviorSubject<AbstractEvent<any> | null> = new BehaviorSubject<AbstractEvent<any> | null> (null);
	
	constructor(
		private eventRegistry: EventRegistryService,
		private domSanitizer: DomSanitizer
	) {
	}
	
	public getEventFromType(val: EventType, actionStep: boolean): AbstractEvent<any> {
		const eventClass = this.eventRegistry.getEvent(val.type);
		const instance: AbstractEvent<any> = new eventClass(this.domSanitizer, val, actionStep);
		
		if (val.type === 'IF') {
			const valIf = val as any;
			valIf.thenStep = valIf.thenStep.map((v: EventType) => this.getEventFromType(v, actionStep));
			if (valIf.elseStep) {
				valIf.elseStep = valIf.elseStep.map((v: EventType) => this.getEventFromType(v, actionStep));
			}
		} else if (val.type === 'SHOW_CHOICE' || val.type === 'SHOW_MODAL_CHOICE') {
			const valChoice = val as any;
			valChoice.options.forEach((option: any, index: number) => {
				valChoice[index] = valChoice[index].map((v: EventType) => this.getEventFromType(v, actionStep));
			});
		} else if (val.type === 'START_NPC_TRADE_MENU') {
			const valTradeMenu = val as any;
			if (valTradeMenu.withBranches) {
				valTradeMenu.traded = (valTradeMenu.traded ?? []).map((v: EventType) => this.getEventFromType(v, actionStep));
				valTradeMenu.canceled = (valTradeMenu.canceled ?? []).map((v: EventType) => this.getEventFromType(v, actionStep));
			}
		} else if (val.type === 'OPEN_QUEST_DIALOG') {
			const valQuestDialog = val as any;
			valQuestDialog.accepted = valQuestDialog.accepted.map((v: EventType) => this.getEventFromType(v, actionStep));
			valQuestDialog.declined = valQuestDialog.declined.map((v: EventType) => this.getEventFromType(v, actionStep));
		}
		
		instance.update();
		
		return instance;
	}
}
