import {Axis, ICameraInput, Nullable, Vector3} from '@babylonjs/core';
import {CustomFreeCamera} from './custom-free-camera';


/**
 * Uses WASD to move camera in all directions and QE to move it up/down
 */
export class WasdCamInput implements ICameraInput<CustomFreeCamera> {
	camera: Nullable<CustomFreeCamera> = null;

	private onKeyDown?: any;
	private onKeyUp?: any;
	private keys = new Set<string>();
	private keysLeft = ['KeyA'];
	private keysRight = ['KeyD'];
	private keysForward = ['KeyW'];
	private keysBackward = ['KeyS'];
	private keysUp = ['KeyQ'];
	private keysDown = ['KeyE'];
	private keysAll = [...this.keysLeft, ...this.keysRight, ...this.keysForward, ...this.keysBackward, ...this.keysUp, ...this.keysDown];
	private sensibility = 0.1;

	attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
		const _this = this;
		if (!this.onKeyDown) {
			element.tabIndex = 1;
			this.onKeyDown = function (evt: KeyboardEvent) {
				if (_this.keysAll.includes(evt.code)) {
					_this.keys.add(evt.code);
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
			this.onKeyUp = function (evt: KeyboardEvent) {
				if (_this.keysAll.includes(evt.code)) {
					_this.keys.delete(evt.code);
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};

			element.addEventListener('keydown', this.onKeyDown, false);
			element.addEventListener('keyup', this.onKeyUp, false);
		}
	}

	detachControl(element: HTMLElement): void {
		if (this.onKeyDown) {
			element.removeEventListener('keydown', this.onKeyDown);
			element.removeEventListener('keyup', this.onKeyUp);
			this.keys.clear();
			this.onKeyDown = null;
			this.onKeyUp = null;
		}
	}

	checkInputs() {
		if (this.onKeyDown) {
			const camera = this.camera!;
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
				}

				camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
				Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
				camera.cameraDirection.addInPlace(camera._transformedDirection);
			}
		}
	}

	private moveCam() {
	}

	getClassName(): string {
		return 'WasdCamInput';
	}

	getSimpleName(): string {
		return 'WasdCamInput';
	}

}
