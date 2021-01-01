import { Point3, Point } from './cross-code-map';

export interface EnemyData {
    name: string;
    boss: boolean;
    bossLabel?: string;
    bossOrder?: number;
    detectType?: DETECT_TYPE;
    credit?: number;
    aiGroup?: string;
    aiLearnType?: ENEMY_AI_LEARN;
    enduranceScale?: number;
    exp?: number;
    level?: number;
    boostedLevel?: number;
    maxSp?: number;
    headIdx: number;
    healDropRate?: number;
    itemDrops: any[];
    trackers: any;
    params: any;
    elementModes: any;
    modifiers: any;
    hpBreaks: any[];
    anims: string;
    size: Point3;
    cameraZFocus?: number;
    dmgZFocus?: number;
    padding?: Point;
    walkConfigs: any;
    material?: COMBATANT_MATERIAL;
    proxies: any;
    targetDetect: any;
    actions: any;
    defaultState: any;
    states: any;
    reactions: any;
}

export enum DETECT_TYPE {
    DISTANCE,
    VIEW,
    NONE
}

export enum ENEMY_AI_LEARN {
    REGULAR,
    IMMEDIATELY
}

export enum COMBATANT_MATERIAL {
    METAL,
    ORGANIC
}
