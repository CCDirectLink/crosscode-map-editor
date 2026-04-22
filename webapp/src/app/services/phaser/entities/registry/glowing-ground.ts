import { ScaleSettings } from '../cc-entity';
import { DefaultEntity } from './default-entity';

export interface GlowingGroundAttributes {
	color1: string;
	color2: string;
	duration?: number;
}

export class GlowingGround extends DefaultEntity {

	override getScaleSettings(): ScaleSettings {
		return {
			scalableX: true,
			scalableY: true,
			scalableStep: 1,
			baseSize: { x: 32, y: 32 },
		};
	}

	protected override async setupType(settings: GlowingGroundAttributes): Promise<void> {
		const color = GlowingGround.parseColor(settings.color1);
		this.generateNoImageType(color.rgb, color.a, color.rgb, color.a);
	}

	private static parseColor(input: string | undefined): { rgb: number; a: number } {
		if (!input) {
			return { rgb: 0xffffff, a: 0.5 };
		}
		const phaserColor = Phaser.Display.Color.ValueToColor(input) as Phaser.Display.Color;
		const rgb = (phaserColor.red << 16) | (phaserColor.green << 8) | phaserColor.blue;
		const a = phaserColor.alphaGL;
		return { rgb, a: a > 0 ? a : 1 };
	}
}
