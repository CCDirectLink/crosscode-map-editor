import {Scene} from '@babylonjs/core';
import {AdvancedDynamicTexture, Button, Control, StackPanel} from '@babylonjs/gui';

export class ToggleMesh {
	
	private texture: AdvancedDynamicTexture;
	private buttonWidth = 150;
	private padding = 5;
	private panel: StackPanel;
	
	constructor(scene: Scene) {
		this.texture = AdvancedDynamicTexture.CreateFullscreenUI('myui', true, scene);
		this.panel = new StackPanel();
		this.panel.isVertical = false;
		this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.texture.addControl(this.panel);
	}
	
	addButton(title: string, action: () => void) {
		const button1 = Button.CreateSimpleButton('but1', title);
		button1.widthInPixels = this.buttonWidth;
		button1.height = '40px';
		button1.color = 'white';
		button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
		button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		button1.cornerRadius = 3;
		button1.paddingBottomInPixels = 5;
		button1.paddingLeftInPixels = this.padding;
		button1.background = 'rgba(78,78,78, 0)';
		button1.onPointerUpObservable.add(action);
		this.panel.addControl(button1);
	}
}
