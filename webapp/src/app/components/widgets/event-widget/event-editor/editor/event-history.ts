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

interface AddDeleteRestorePoint {
	type: 'addDelete';
	from: AbstractEvent<any>[];
	fromRef: AbstractEvent<any>[];
}

type RestorePoint = EditRestorePoint | MoveRestorePoint | AddDeleteRestorePoint;

export class EventHistory {
	private history: RestorePoint[] = [];
	private undoHistory: RestorePoint[] = [];

	private selected: EditRestorePoint | undefined;

	public select(node: AbstractEvent<any>): void {
		this.commitEdits();
		this.selected = this.createRestorePoint(node);
	}

	public move(from: AbstractEvent<any>[], to: AbstractEvent<any>[]): void {
		this.commitEdits();

		this.history.push({
			type: 'move',
			from: Object.assign([], from),
			fromRef: from,
			to: Object.assign([], to),
			toRef: to,
		});

		this.undoHistory = [];
	}

	public add(from: AbstractEvent<any>[]): void {
		this.delete(from); //Adding is the same as removing from the viewpoint of the history
	}

	public delete(from: AbstractEvent<any>[]): void {
		this.commitEdits();

		this.history.push({
			type: 'addDelete',
			from: Object.assign([], from),
			fromRef: from,
		});

		this.undoHistory = [];
	}

	public undo(): void {
		this.commitEdits();

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
	}

	private commitEdits(): void {
		if (this.hasChanged(this.selected)) {
			const last = this.history[this.history.length - 1];
			if (last?.type === 'edit' && last.ref === this.selected.ref) {
				return; //Already commited
			}

			this.history.push(this.selected);
			this.undoHistory = [];

			this.selected = this.createRestorePoint(this.selected.ref);
		}
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
				if (this.selected?.ref === rp.ref) {
					this.selected = rp;
				}
				break;
			case 'move':
				Object.assign(rp.toRef, rp.to);
				Object.assign(rp.fromRef, rp.from);
				rp.toRef.length = rp.to.length;
				rp.fromRef.length = rp.from.length;
				break;
			case 'addDelete':
				Object.assign(rp.fromRef, rp.from);
				rp.fromRef.length = rp.from.length;
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
			case 'addDelete':
				return {
					type: 'addDelete',
					from: Object.assign([], rp.fromRef),
					fromRef: rp.fromRef,
				};
		}
	}

	private hasChanged(
		selected: EditRestorePoint | undefined,
	): selected is EditRestorePoint {
		return (
			!!selected && JSON.stringify(selected.ref.data) !== selected.data
		);
	}
}
