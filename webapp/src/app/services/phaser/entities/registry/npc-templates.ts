import { Globals } from '../../../globals';

export type NPCTemplates = typeof import('../../../../../assets/json-templates.json');

export function getNPCTemplates(): Promise<NPCTemplates> {
	return Globals.jsonLoader.loadJsonMerged<NPCTemplates>('json-templates.json');
}
