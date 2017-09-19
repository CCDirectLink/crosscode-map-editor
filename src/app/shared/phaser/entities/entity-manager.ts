import {CCEntity} from './cc-entity';
import {Sortable} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {CCMap} from '../tilemap/cc-map';

export class EntityManager extends Phaser.Plugin implements Sortable {

	public zIndex: number;
	private keyBindings: Phaser.SignalBinding[] = [];
	private map: CCMap;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.zIndex = 900;

	}

	private openContextMenu() {
		const game = this.game;
		const p = Helper.screenToWorld(game, game.input.mousePointer);
		const test = new CCEntity(this.game, this.map, p.x, p.y);
		console.log(test);
	}

	update() {

	}

	initialize(map: CCMap) {
		this.map = map;

		map.entities.forEach(entity => {
			entity.setInputEvents((e, pointer) => {
				console.log(e);
				console.log(pointer);
			});
		});
	}

	deactivate() {
		this.map.entities.forEach(entity => {
			entity.setEnableInput(false);
		});
		this.keyBindings.forEach(binding => binding.detach());
		this.keyBindings = [];
	}

	activate() {
		this.map.entities.forEach(entity => {
			entity.setEnableInput(true);
		});
		this.keyBindings.push(this.game.input.mousePointer.rightButton.onDown.add(() => this.openContextMenu()));
	}

}
