import { Scene, UniversalCamera, Vector3 } from '@babylonjs/core';
import { WasdCamInput } from './wasd-cam-input';

/**
 * Same as Free Camera but uses WASD instead of arrow keys to control
 */
export class CustomFreeCamera extends UniversalCamera {
	constructor(name: string, position: Vector3, scene: Scene) {
		super(name, position, scene);
		this.inertia = 0;
		this.angularSensibility = 490;
		this.inputs.removeByType('FreeCameraKeyboardMoveInput');
		this.inputs.add(new WasdCamInput());
	}
}
