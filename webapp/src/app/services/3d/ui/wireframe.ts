import { Material, Mesh } from '@babylonjs/core';
import { ToggleMesh } from '../debug/toggle-mesh';

export function addWireframeButton(toggle: ToggleMesh, meshes: Mesh[]) {
	const materials = new Set<Material>();
	for (const mesh of meshes) {
		materials.add(mesh.material!);
	}

	toggle.addButton('wireframe', () => {
		for (const mat of materials) {
			mat.wireframe = !mat.wireframe;
		}
	});
}
