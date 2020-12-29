import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { AbstractEvent, EventType } from '../../event-registry/abstract-event';
import { EventHelperService } from '../event-helper.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SplitPaneComponent } from '../../../../split-pane/split-pane.component';
import { EventDisplay } from '../event-display.model';
import { AddEventService } from '../add/add-event.service';
import { EventHistory } from './event-history';
import { EventDetailComponent } from '../detail/event-detail.component';

@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditorComponent implements OnChanges {
	@ViewChild('splitpane') splitPane?: SplitPaneComponent;
	@ViewChild('eventDetail', {static: true}) eventDetail?: unknown; //EventDetailComponent but it errors for some reason
	@ViewChild('eventTree', {read: ElementRef}) eventTree?: ElementRef<HTMLElement>;
	
	@Input() eventData: EventType[] = [];
	@Input() actionStep = false;
	
	detailsShown = false;

	treeControl = new FlatTreeControl<EventDisplay>(e => e.level, e => e.children != null);
	private treeFlattener = new MatTreeFlattener(
		(node: EventDisplay, level: number) => {
			node.level = level; return node; 
		},
		e => e.level,
		e => e.children != null,
		e => this.convertNodes(e.children!));
	dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	
	private history = new EventHistory();
	private workingData!: AbstractEvent<any>[];
	private selectedNode?: EventDisplay;
	private shownNode?: EventDisplay;
	private copiedNode?: EventDisplay;

	constructor(
		private helper: EventHelperService,
		private addEvent: AddEventService,
	) { }
	
	show() {
		this.detailsShown = false;
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
		this.refreshAll();
	}

	sortPredicate(index: number, item: CdkDrag<EventDisplay>, drop: CdkDropList<EventDisplay>) {
		//TODO: Prevent placeholder if element cannot go there (this.isChildOf(...))
		return index < this.treeControl.dataNodes.length - 1;
	}

	refresh() {
		if (this.shownNode) {
			this.shownNode.text = this.shownNode.data?.info ?? ' ';
			this.shownNode.changeDetector?.detectChanges();

			if (this.shownNode.children) {
				this.refreshAll();
			}
		}
	}
	
	hideDetails(): void {
		this.detailsShown = false;
	}
	
	export() {
		return this.workingData?.map(event => event.export()) ?? this.eventData;
	}
	
	drop(event: CdkDragDrop<EventDisplay>) {
		if (event.currentIndex === event.previousIndex) {
			return;
		}

		const moved = event.item.data as EventDisplay;
		const belowIndex = event.currentIndex + (event.currentIndex > event.previousIndex ? 1 : 0); //Add 1 to compensate for a missing this.treeControl.dataNodes.splice
		const below = this.treeControl.dataNodes[belowIndex];

		if (this.isChildOf(below, moved)) {
			return;
		}

		const fromParent = this.getParent(moved);
		const toParent = this.getParent(below);

		this.history.move(fromParent, toParent);

		fromParent.splice(fromParent.indexOf(moved.data!), 1);

		const toIndex = toParent.indexOf(below?.data!);
		toParent.splice(toIndex >= 0 ? toIndex : toParent.length, 0, moved.data!);

		this.refreshAll();
		this.focus();
	}

	eventClicked(_: MouseEvent, node: EventDisplay | null) {
		this.select(node);
	}

	openAddMenu(event: Event, node: EventDisplay | null) {
		this.select(node);

		event.stopPropagation();
		if (event.cancelable) {
			event.preventDefault();
		}

		this.addEvent.showAddEventMenu({
			left: 'calc(18vw)',
			top: '6vh'
		}, this.actionStep).subscribe(newEvent => {
			this.history.add(this.getParent(this.selectedNode));

			const index = this.getIndex(this.selectedNode);
			const parent = this.getParent(this.selectedNode);
			parent.splice(index, 0, newEvent);

			this.refreshAll();
			this.selectAbstractEvent(newEvent);
			this.focus();
		});
	}
	
	keyPress(event: KeyboardEvent) {
		if (event.cancelable) {
			event.preventDefault();
		}

		switch (event.code) {
		case 'ArrowUp':
		case 'ArrowLeft':
			this.selectUp();
			return;
		case 'ArrowDown':
		case 'ArrowRight':
			this.selectDown();
			return;
		case 'Enter':
			this.openAddMenu(event, null);
			return;
		case 'Delete':
			this.delete();
			return;
		case 'Escape':
			this.deselect();
			return;
		}

		if (event.ctrlKey) {
			switch (event.key.toLowerCase()) {
			case 'c':
				this.copy();
				return;
			case 'x':
				this.copy();
				this.delete();
				return;
			case 'v':
				this.paste();
				return;
			case 'z':
				if (event.shiftKey) {
					this.redo();
				} else {
					this.undo();
				}
				return;
			}
		}
	}

	private refreshTree() {
		this.dataSource.data = this.convertNodes(this.workingData);
		this.treeControl.expandAll();
	}

	private focus() {
		this.eventTree?.nativeElement.focus();
	}
	
	private getParent(node: EventDisplay | null | undefined): AbstractEvent<any>[] {
		return node?.parent ?? this.workingData;
	}

	private select(node: EventDisplay | null | undefined) {
		if (!node) {
			return;
		}

		if (this.selectedNode) {
			this.selectedNode.isSelected = false;
			this.selectedNode.changeDetector?.detectChanges();
		}
		
		node.isSelected = true;
		node.changeDetector?.detectChanges();
		this.selectedNode = node;
		this.showEvent(node);
	}

	private showEvent(node: EventDisplay) {
		if (node.data) {
			(this.eventDetail as EventDetailComponent).loadEvent(node.data);
			this.shownNode = node;
			this.detailsShown = true;
			this.history.select(node.data);
		}
	}

	private selectAbstractEvent(event: AbstractEvent<any>) {
		const node = this.treeControl.dataNodes.find(n => n.data === event)!;
		this.select(node);
	}

	private selectUp() {
		const index = this.treeControl.dataNodes.indexOf(this.selectedNode!);
		const finalIndex = index <= 0 ? this.treeControl.dataNodes.length - 1 : index - 1;
		this.select(this.treeControl.dataNodes[finalIndex]);
	}

	private selectDown() {
		const index = this.treeControl.dataNodes.indexOf(this.selectedNode!);
		const finalIndex = index < 0 || index === this.treeControl.dataNodes.length - 1 ? 0 : index + 1;
		this.select(this.treeControl.dataNodes[finalIndex]);
	}

	private deselect() {
		this.detailsShown = false;
		this.shownNode = undefined;
		
		if (this.selectedNode) {
			this.selectedNode.isSelected = false;
			this.selectedNode.changeDetector?.detectChanges();
			this.selectedNode = undefined;
		}
	}

	private delete() {
		if (!this.selectedNode?.data) {
			return;
		}

		this.history.delete(this.selectedNode.parent);
		
		const globalIndex = this.treeControl.dataNodes.findIndex(n => n === this.selectedNode);

		const index = this.getIndex(this.selectedNode);
		const parent = this.getParent(this.selectedNode);
		parent.splice(index, 1);

		this.refreshAll();

		if (this.shownNode === this.selectedNode) {
			this.detailsShown = false;
			this.shownNode = undefined;
		}

		const selectIndex = globalIndex >= this.treeControl.dataNodes.length ? 0 : globalIndex;
		this.select(this.treeControl.dataNodes[selectIndex]);
		
		this.focus();
	}

	private copy() {
		if (this.selectedNode?.data) {
			this.copiedNode = this.selectedNode;
		}
	}
	
	private paste() {
		if (this.copiedNode) {
			const cpy = JSON.parse(JSON.stringify(this.copiedNode.data?.data));
			const event = this.helper.getEventFromType(cpy, this.actionStep);

			const index = !this.selectedNode ? 0 : this.getIndex(this.selectedNode!);
			const parent = this.getParent(this.selectedNode);
			parent.splice(index, 0, event);

			this.refreshAll();
			this.selectAbstractEvent(event);
			this.focus();
		}
	}

	private undo() {
		this.history.undo();
		this.refreshAll();
		this.focus();
	}

	private redo() {
		this.history.redo();
		this.refreshAll();
		this.focus();
	}

	private refreshAll() {
		const selected = this.selectedNode?.data;
		const selectedParent = this.selectedNode?.parent;
		const shown = this.detailsShown;
		const shownData = this.shownNode?.data;

		this.refreshTree();
		this.deselect();
		if (shownData) {
			this.selectAbstractEvent(shownData);
		}
		if (selectedParent) {
			//Similar to this.selectAbstractEvent but also handles undefined as data
			this.selectedNode = this.treeControl.dataNodes.find(n => n.parent === selectedParent && n.data === selected)!;
			this.selectedNode.isSelected = true;
			this.selectedNode.changeDetector?.detectChanges();
		}
		this.detailsShown = shown;
	}

	private getIndex(event: EventDisplay | null | undefined) {
		const parent = this.getParent(event);
		const index = parent.indexOf(event?.data!);
		return index === -1 ? parent.length : index;
	}

	private isChildOf(child: EventDisplay, parent: EventDisplay): boolean {
		let node: EventDisplay | undefined = child;
		while (node) {
			if (node === parent || (node.data && node.data === parent.data)) {
				return true;
			}

			node = this.treeControl.dataNodes.find(n => n.children === node!.parent);
		}

		return false;
	}
	
	private convertNodes(nodes: AbstractEvent<any>[]): EventDisplay[] {
		const result: EventDisplay[] = [];
		for (const node of nodes) {
			const entry: EventDisplay = {
				text: node.info,
				draggable: true,
				isActionStep: this.actionStep,
				isSelected: false,
				data: node,
				parent: nodes,
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
					isSelected: false,
					data: node,
					level: 0,
					children: child.events,
					parent: nodes,
				});
			}
		}
		
		result.push({
			text: ' ',
			draggable: false,
			isActionStep: this.actionStep,
			isSelected: false,
			level: 0,
			parent: nodes,
		});
		
		return result;
	}
}
