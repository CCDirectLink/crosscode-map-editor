import { EventType } from '../components/widgets/event-widget/event-registry/abstract-event';

export interface Person {
	person: string;
	expression: string;
}

export interface Label {
	de_DE: string;
	en_US: string;
	fr_FR: string;
	zh_CN: string;
	ja_JP: string;
	ko_KR: string;
	langUid: number;
}

export enum EventArrayType {
	Simple = 'simple',
	Quest = 'quest',
	Shop = 'shop',
	Arena = 'arena',
	Trade = 'trade',
}

export interface TraderEvent {
	event?: EventType[];
	trader?: string; //Maps have it but it's a pain to handle type set and trader set at the same time in the UI
}

export type EventArray =
	| EventType[]
	| { quest: EventType[] }
	| { shop: EventType[] }
	| { arena: EventType[] }
	| { trade: TraderEvent };

export function destructureEventArray(events: EventArray): {
	events: EventType[];
	type: EventArrayType;
	trader?: string;
} {
	if (Array.isArray(events)) {
		return { events: events, type: EventArrayType.Simple };
	} else if ('quest' in events) {
		return { events: events.quest, type: EventArrayType.Quest };
	} else if ('shop' in events) {
		return { events: events.shop, type: EventArrayType.Shop };
	} else if ('arena' in events) {
		return { events: events.arena, type: EventArrayType.Arena };
	} else if ('trade' in events) {
		const event = events.trade.event;
		return {
			events: event ?? [],
			type: EventArrayType.Trade,
			trader: events.trade.trader,
		};
	}
	throw new TypeError(
		'Argument passed to ' +
			destructureEventArray.name +
			' is not of type EventArray.',
	);
}

export function createEventArray(
	events: EventType[],
	type: EventArrayType,
	trader?: string,
): EventArray {
	switch (type) {
		case EventArrayType.Simple:
			return events;
		case EventArrayType.Arena:
			return { arena: events };
		case EventArrayType.Quest:
			return { quest: events };
		case EventArrayType.Shop:
			return { shop: events };
		case EventArrayType.Trade:
			return {
				trade: {
					event: events.length > 0 ? events : undefined,
					trader: trader,
				},
			};
		default:
			throw new TypeError(
				`'type' argument passed to ${createEventArray.name} must be of type EventArrayType. Received ${type as unknown as string} instead.`,
			);
	}
}
