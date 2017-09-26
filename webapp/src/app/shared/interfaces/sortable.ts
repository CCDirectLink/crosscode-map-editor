export interface Sortable {
	zIndex?: number;
}

export interface SortableGroup extends Phaser.Group, Sortable {
}
