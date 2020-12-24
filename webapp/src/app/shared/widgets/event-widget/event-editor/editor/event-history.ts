import { AbstractEvent } from '../../event-registry/abstract-event';

interface EditRestorePoint {
	type: 'edit';
	ref: AbstractEvent<any>;
	data: string;
}

interface MoveRestorePoint {
	type: 'move';
	from: AbstractEvent<any>[];
	fromRef: AbstractEvent<any>[];
	to: AbstractEvent<any>[];
	toRef: AbstractEvent<any>[];
}

type RestorePoint = EditRestorePoint | MoveRestorePoint;

export class EventHistory {
	private history: RestorePoint[] = [];
	private undoHistory: RestorePoint[] = [];

	private selected: EditRestorePoint | undefined;

	public select(node: AbstractEvent<any>): void {
		if (this.hasChanged(this.selected)) {
			this.history.push(this.selected);
			this.undoHistory = [];
		}

		this.selected = this.createRestorePoint(node);
	}

	public move(from: AbstractEvent<any>[], to: AbstractEvent<any>[]) {
		if (this.hasChanged(this.selected)) {
			this.history.push(this.selected);
			this.selected = this.createRestorePoint(this.selected.ref);
		}

		this.history.push({
			type: 'move',
			from: Object.assign([], from),
			fromRef: from,
			to: Object.assign([], to),
			toRef: to,
		});

		this.undoHistory = [];
	}
	
	public undo(): void {
		if (this.hasChanged(this.selected)) {
			const rp = this.invertRestorePoint(this.selected);
			this.undoHistory.push(rp);

			this.applyRestorePoint(this.selected);
			this.selected = this.createRestorePoint(this.selected.ref);
			return;
		}

		if (this.history.length <= 0) {
			return;
		}

		const last = this.history.pop()!;
		const rp = this.invertRestorePoint(last);
		this.undoHistory.push(rp);

		this.applyRestorePoint(last);
	}

	public redo(): void {
		if (this.undoHistory.length <= 0) {
			return;
		}

		const last = this.undoHistory.pop()!;
		const rp = this.invertRestorePoint(last);
		this.applyRestorePoint(last);

		this.history.push(rp);

		//TODO: is this.selected correct here?
	}

	private createRestorePoint(node: AbstractEvent<any>): EditRestorePoint {
		return {
			type: 'edit',
			ref: node,
			data: JSON.stringify(node.data),
		};
	}

	private applyRestorePoint(rp: RestorePoint): void {
		switch (rp.type) {
		case 'edit':
			rp.ref.data = JSON.parse(rp.data);
			rp.ref.update();
			break;
		case 'move':
			Object.assign(rp.toRef, rp.to);
			Object.assign(rp.fromRef, rp.from);
			break;
		}
	}

	private invertRestorePoint(rp: RestorePoint): RestorePoint {
		switch (rp.type) {
		case 'edit':
			return this.createRestorePoint(rp.ref);
		case 'move':
			return {
				type: 'move',
				from: Object.assign([], rp.fromRef),
				fromRef: rp.fromRef,
				to: Object.assign([], rp.toRef),
				toRef: rp.toRef,
			};
		}
	}

	private hasChanged(selected: EditRestorePoint | undefined): selected is EditRestorePoint {
		return !!selected && JSON.stringify(selected.ref.data) !== selected.data;
	}
}
