import { CCEntity, ScaleSettings, EntityAttributes } from '../cc-entity';
import { Point3 } from '../../../../models/cross-code-map';
import { Anims, AnimSheet } from './prop';
import { Helper } from '../../helper';

export class Destructible extends CCEntity {
    private attributes: EntityAttributes = {
        desType: {
            type: 'String',
            description: 'Type of destructible object',
            withNull: true,
        },
        enemyInfo: {
            type: 'EnemyType',
            description: 'Enemy to spawn after destruction',
            withNull: true,
        },
        spawnCondition: {
            type: 'VarCondition',
            description: 'Condition for Enemy to spawn',
        },
        blockNavMap: {
            type: 'Boolean',
            description: 'If true, block path map and update when destroyed',
        },
        permaDestruct: {
            type: 'Boolean',
            description: 'If true, then destructible stays destroyed after reentering map',
        },
        onDestructIncrease: {
            type: 'VarName',
            description: 'Variable to increase by one when destroyed',
        },
        onPreDestructIncrease: {
            type: 'VarName',
            description: 'Variable to increase by one when destroyed'
        }
    };

    public getAttributes(): EntityAttributes {
        return this.attributes;
    }

    public getScaleSettings(): ScaleSettings | undefined {
        return undefined;
    }

    protected async setupType(settings: any): Promise<void> {
        const types = this.scene.cache.json.get('destructible-types.json') as DestructibleTypes;

        this.attributes.desType.options = {};
        for (const name of Object.keys(types)) {
            this.attributes.desType.options[name] = name;
        }

        const type = types[settings.desType];
        if (!type) {
			this.generateNoImageType(0xFF0000, 1);
			return;
        }

        const sheet = type.anims.sheet;
        const animSheet = type.anims.sheet as AnimSheet;
        const gfx = (sheet instanceof String) ? sheet as string : animSheet.src;

        const exists = await Helper.loadTexture(gfx, this.scene);
		if (!exists) {
			this.generateErrorImage();
			return;
        }

        
		this.entitySettings = <any>{
			sheets: {
				fix: [{
					gfx: gfx,
					x: animSheet.offX || 0,
					y: animSheet.offY || 0,
					w: animSheet.width || 16,
					h: animSheet.height || 16,
				}]
			},
			baseSize: type.size,
		};
        this.updateSettings();
    }

}

interface DestructibleTypes {
    [name: string]: DestructibleType;
}

interface DestructibleType {
    hitCount: number;
    size: Point3;
    anims: Anims;
    preBoom?: SheetReference;
    boom?: SheetReference;
    debris?: SheetReference;
    hitSide?: [0|1, 0|1, 0|1, 0|1];
    hitSound?: unknown;
    terrain?: number;
    debrisAngle?: number;
    keyConsume?: string;
    range?: {
        key: string,
        delay: number,
        padding: number,
        startDelay?: number,
    };
}

interface SheetReference {
    sheet: string;
    name: string;
}
