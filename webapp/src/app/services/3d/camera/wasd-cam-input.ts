import {ICameraInput, Nullable, Vector3} from '@babylonjs/core';
import {CustomFreeCamera} from './custom-free-camera';


/**
 * Uses WASD to move camera in all directions and QE to move it up/down
 */
export class WasdCamInput implements ICameraInput<CustomFreeCamera> {
	camera: Nullable<CustomFreeCamera> = null;
	
	private onKeyDown?: (evt: KeyboardEvent) => void;
	private onKeyUp?: (evt: KeyboardEvent) => void;
	private keys = new Set<string>();
	private keysLeft = ['KeyA'];
	private keysRight = ['KeyD'];
	private keysForward = ['KeyW'];
	private keysBackward = ['KeyS'];
	private keysUp = ['KeyE'];
	private keysDown = ['KeyQ'];
	private keysTurbo = ['ShiftLeft'];
	private keysAll = [
		...this.keysLeft,
		...this.keysRight,
		...this.keysForward,
		...this.keysBackward,
		...this.keysUp,
		...this.keysDown,
		...this.keysTurbo
	];
	private sensibility = 11.8;
	
	attachControl(noPreventDefault?: boolean): void {
		const engine = this.camera!.getEngine();
		const element = engine.getInputElement()!;
		if (!this.onKeyDown) {
			element.tabIndex = 1;
			this.onKeyDown = evt => {
				if (this.keysAll.includes(evt.code)) {
					this.keys.add(evt.code);
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
			this.onKeyUp = evt => {
				if (this.keysAll.includes(evt.code)) {
					this.keys.delete(evt.code);
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
			
			element.addEventListener('keydown', this.onKeyDown, false);
			element.addEventListener('keyup', this.onKeyUp, false);
		}
	}
	
	detachControl(): void {
		const engine = this.camera!.getEngine();
		const element = engine.getInputElement()!;
		if (this.onKeyDown) {
			element.removeEventListener('keydown', this.onKeyDown);
			element.removeEventListener('keyup', this.onKeyUp!);
			this.keys.clear();
			this.onKeyDown = undefined;
			this.onKeyUp = undefined;
		}
	}
	
	checkInputs() {
		if (this.onKeyDown) {
			const camera = this.camera!;
			const scale = this.keysTurbo.some(t => this.keys.has(t)) ? 3.5 : 1;
			
			for (const key of this.keys) {
				const speed = camera._computeLocalCameraSpeed();
				
				if (this.keysForward.includes(key)) {
					camera._localDirection.copyFromFloats(0, 0, speed);
				} else if (this.keysBackward.includes(key)) {
					camera._localDirection.copyFromFloats(0, 0, -speed);
				} else if (this.keysRight.includes(key)) {
					camera._localDirection.copyFromFloats(speed, 0, 0);
				} else if (this.keysLeft.includes(key)) {
					camera._localDirection.copyFromFloats(-speed, 0, 0);
				} else if (this.keysUp.includes(key)) {
					camera._localDirection.copyFromFloats(0, speed, 0);
				} else if (this.keysDown.includes(key)) {
					camera._localDirection.copyFromFloats(0, -speed, 0);
				} else if (this.keysTurbo.includes(key)) {
					continue;
				}
				
				camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
				Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
				camera._transformedDirection.scaleToRef(this.sensibility * scale, camera._transformedDirection);
				camera.cameraDirection.addInPlace(camera._transformedDirection);
			}
		}
	}
	
	getClassName(): string {
		return 'WasdCamInput';
	}
	
	getSimpleName(): string {
		return 'WasdCamInput';
	}
	
}
