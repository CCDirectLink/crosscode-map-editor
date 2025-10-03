import { ChangeDetectorRef } from '@angular/core';
import { AbstractEvent } from '../event-registry/abstract-event';

export interface EventDisplay {
	text: string;
	draggable: boolean;
	isActionStep: boolean;
	isSelected: boolean;
	parent: AbstractEvent<any>[];
	data?: AbstractEvent<any>;
	children?: AbstractEvent<any>[];

	level: number;
	changeDetector?: ChangeDetectorRef;
}
