import {
	Component,
	Input,
	ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import { AbstractEvent, EventType } from '../../event-registry/abstract-event';
import { EventHelperService } from '../event-helper.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface EventDisplay {
	text: string;
	draggable: boolean;
	isActionStep: boolean;
	data?: AbstractEvent<any>;
	children?: AbstractEvent<any>[];

	level: number;
}

@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditorComponent implements OnChanges {
	@Input() eventData: EventType[] = [];
	@Input() actionStep = false;

	workingData?: AbstractEvent<any>[];

	treeControl = new FlatTreeControl<EventDisplay>(e => e.level, e => e.children != null);
	treeFlattener = new MatTreeFlattener(
		(node: EventDisplay, level: number) => this.setLevel(node, level), 
		e => e.level, 
		e => e.children != null, 
		e => this.convertNodes(e.children!));
	dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

	constructor(private helper: EventHelperService) {
		helper.selectedEvent.subscribe(v => {
			if (v) {
				// TODO: remove event?
				// console.log(v.text);
			}
		});
	}

	show() {
		console.log(this.workingData);
	}

	ngOnChanges() {
		let cpy = JSON.parse(JSON.stringify(this.eventData));
		if (!cpy.map) {
			// TODO: find out how to properly handle quests
			cpy = cpy.quest;
		}
		if (cpy.map) {
			this.workingData = cpy.map((val: EventType) => this.helper.getEventFromType(val, this.actionStep));
		} else {
			this.workingData = [];
		}
		this.dataSource.data = this.convertNodes(this.workingData!);
		this.treeControl.expandAll();
	}

	refresh(event?: AbstractEvent<any>) {
		const display = this.treeControl.dataNodes.find(node => node.data === event);
		if (!event || !display) {
			this.dataSource.data = this.convertNodes(this.workingData!);
			this.treeControl.expandAll();
		} else {
			display.text = event.info;
		}
	}

	export() {
		if (this.workingData) {
			return this.workingData.map(event => event.export());
		} else {
			return this.eventData;
		}
	}

	getParent(node: EventDisplay): AbstractEvent<any>[] | null {
		const currentLevel = this.treeControl.getLevel(node);
		if (currentLevel <= 0) {
			return this.workingData!;
		}

		const currentIndex = this.treeControl.dataNodes.indexOf(node);
		for (let i = currentIndex - 1; i >= 0; i--) {
			const node = this.treeControl.dataNodes[i];

			if (this.treeControl.getLevel(node) < currentLevel) {
				return node.children as AbstractEvent<any>[];
			}
		}
		
		return this.workingData!;
	}

	drop(event: CdkDragDrop<EventDisplay>) {
		const moved = event.item.data as EventDisplay;
		const fromParent = this.getParent(moved) || this.workingData!;

		if (event.currentIndex === 0) {
			this.workingData!.unshift(moved.data!);
		} else {
			const toTop = event.currentIndex > event.previousIndex ? this.treeControl.dataNodes[event.currentIndex] : this.treeControl.dataNodes[event.currentIndex - 1];
			if (this.isChildOf(toTop, moved)) {
				return;
			}

			if (toTop.children != null) {
				toTop.children.unshift(moved.data!);
			} else {
				const toParent = this.getParent(toTop) || this.workingData!;
				const toIndex = toParent.indexOf(toTop.data!);
				if (toIndex >= 0) {
					toParent.splice(toIndex + 1, 0, moved.data!);
				} else {
					toParent.push(moved.data!);
				}
			}
		}

		if (event.currentIndex > event.previousIndex) {
			fromParent.splice(fromParent.indexOf(moved.data!), 1);
		} else {
			fromParent.splice(fromParent.lastIndexOf(moved.data!), 1);
		}
		
		this.refresh();
	}

	private isChildOf(child: EventDisplay, parent: EventDisplay): boolean {
		let currentLevel = this.treeControl.getLevel(child);
		if (currentLevel <= 0) {
			return false;
		}

		const currentIndex = this.treeControl.dataNodes.indexOf(child);
		for (let i = currentIndex - 1; i >= 0; i--) {
			const node = this.treeControl.dataNodes[i];
			const nodeLevel = this.treeControl.getLevel(node);

			if (node === parent) {
				return nodeLevel === currentLevel - 1;
			}

			currentLevel = Math.min(currentLevel, nodeLevel);
		}
		
		return false;
	}


	private setLevel(node: EventDisplay, level: number): EventDisplay {
		node.level = level;
		return node;
	}

	private convertNodes(nodes: AbstractEvent<any>[]): EventDisplay[] {
		const result: EventDisplay[] = [];
		for (const node of nodes) {
			const entry: EventDisplay = {
				text: node.info,
				draggable: true,
				isActionStep: this.actionStep,
				data: node,
				level: 0,
			};

			if (node.children 
				&& node.children.length > 0
				&& node.children[0].title == null) {
				entry.children = node.children[0].events;
			}

			result.push(entry);

			if (node.children == null) {
				continue;
			}

			for (const child of node.children) {
				if (!child.title) {
					continue;
				}

				result.push({
					text: child.title,
					draggable: child.draggable || false,
					isActionStep: this.actionStep,
					level: 0,
					children: child.events,
				});
			}
		}

		result.push({
			text: ' ',
			draggable: false,
			isActionStep: this.actionStep,
			level: 0
		});

		return result;
	}
}
