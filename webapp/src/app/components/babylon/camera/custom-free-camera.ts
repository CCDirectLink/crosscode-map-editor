import {FreeCamera, Scene, Tools, Vector3} from '@babylonjs/core';
import {WasdCamInput} from './wasd-cam-input';

/**
 * Same as Free Camera but uses WASD instead of arrow keys to control
 */
export class CustomFreeCamera extends FreeCamera {

	constructor(name: string, position: Vector3, scene: Scene, setActiveOnSceneIfNoneActive?: boolean) {
		super(name, position, scene, setActiveOnSceneIfNoneActive);
		this.inputs.removeByType('FreeCameraKeyboardMoveInput');
		this.inputs.add(new WasdCamInput());
	}


}
