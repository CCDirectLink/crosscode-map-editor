import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractEvent, EventType } from './abstract-event';
import { AddMsgPerson } from './add-msg-person';
import { ClearScreenBlur } from './clear-screen-blur';
import { ClearSlowMotion } from './clear-slow-motion';
import { DefaultEvent } from './default-event';
import { DoAction } from './do-action';
import { GotoLabel } from './goto-label';
import { If } from './if';
import { Label } from './label';
import { OpenQuestDialog } from './open-quest-dialogue';
import { SetCameraBetween } from './set-camera-between';
import { SetCameraPos } from './set-camera-pos';
import { SetCameraTarget } from './set-camera-target';
import { SetCameraZoom } from './set-camera-zoom';
import { SetOverlay } from './set-overlay';
import { SetPlayerCore } from './set-player-core';
import { ShowChoice } from './show-choice';
import { ShowMsg } from './show-msg';
import { StartNpcTradeMenu } from './start-npc-trade-menu';
import { Wait } from './wait';
import { ShowSideMsg } from './show-side-msg';
import { ShowModalChoice } from './show-modal-choice';
import { SetMsgExpression } from './set-msg-expression';

type EventConstructor<T extends EventType> = new (domSanitizer: DomSanitizer, data: T, actionStep: boolean) => AbstractEvent<T>;

@Injectable({
	providedIn: 'root'
})
export class EventRegistryService {
	private events: { [type: string]: any } = {};
	private defaultEvent: any;
	
	constructor() {
		this.setDefaultEvent(DefaultEvent);
		this.register('ADD_MSG_PERSON', AddMsgPerson);
		this.register('SHOW_MSG', ShowMsg);
		this.register('SHOW_CHOICE', ShowChoice);
		this.register('IF', If);
		this.register('SET_PLAYER_CORE', SetPlayerCore);
		this.register('CLEAR_SLOW_MOTION', ClearSlowMotion);
		this.register('SET_OVERLAY', SetOverlay);
		this.register('CLEAR_SCREEN_BLUR', ClearScreenBlur);
		this.register('DO_ACTION', DoAction);
		this.register('SET_CAMERA_TARGET', SetCameraTarget);
		this.register('SET_CAMERA_ZOOM', SetCameraZoom);
		this.register('SET_CAMERA_POS', SetCameraPos);
		this.register('SET_CAMERA_BETWEEN', SetCameraBetween);
		this.register('WAIT', Wait);
		this.register('LABEL', Label);
		this.register('GOTO_LABEL', GotoLabel);
		this.register('START_NPC_TRADE_MENU', StartNpcTradeMenu);
		this.register('OPEN_QUEST_DIALOG', OpenQuestDialog);
		this.register('SHOW_SIDE_MSG', ShowSideMsg);
		this.register('SHOW_MODAL_CHOICE', ShowModalChoice);
		this.register('SET_MSG_EXPRESSION', SetMsgExpression);
		
	}
	
	private setDefaultEvent(event: any) {
		this.defaultEvent = event;
	}
	
	private register(type: string, event: any) {
		this.events[type] = event;
	}
	
	public getDefaultEvent(): any {
		return this.defaultEvent;
	}
	
	public getEvent<T extends EventType>(type: string): EventConstructor<T> {
		return this.events[type] || this.defaultEvent;
	}
	
	public getAll() {
		return this.events;
	}
	
	private hasEvent(type: string): boolean {
		return Object.prototype.hasOwnProperty.call(this.events, type);
	}
}
