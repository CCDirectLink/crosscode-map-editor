import * as Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { PreUpdate } from './pre-update';

export interface KeyBinding {
	event: string;
	fun: Function;
	emitter: Phaser.Events.EventEmitter;
}

export abstract class BaseObject extends Phaser.GameObjects.GameObject implements PreUpdate {
	private subs: Subscription[] = [];
	
	private keyBindings: KeyBinding[] = [];
	
	protected constructor(scene: Phaser.Scene, type: string, active = true) {
		super(scene, type);
		this.active = false;
		this.init();
		
		if (active) {
			this.active = true;
			this.activate();
		}
	}
	
	protected abstract init(): void;
	
	abstract preUpdate(time: number, delta: number): void;
	
	protected abstract activate(): void;
	
	protected abstract deactivate(): void;
	
	public override setActive(value: boolean): this {
		if (this.active === value) {
			return this;
		}
		super.setActive(value);
		
		if (value) {
			this.activateInternal();
		} else {
			this.deactivateInternal();
		}
		return this;
	}
	
	private deactivateInternal() {
		this.keyBindings.forEach(binding => {
			binding.emitter.removeListener(binding.event, binding.fun);
		});
		this.keyBindings = [];
		this.subs.forEach(sub => sub.unsubscribe());
		this.subs = [];
		this.deactivate();
	}
	
	private activateInternal() {
		this.activate();
	}
	
	
	protected addKeybinding(binding: KeyBinding) {
		if (!this.active) {
			throw new Error('tried to add keybinding on gameobject that is not active');
		}
		this.keyBindings.push(binding);
		binding.emitter.addListener(binding.event, binding.fun);
	}
	
	protected addSubscription(sub: Subscription) {
		this.subs.push(sub);
	}
	
	
}
