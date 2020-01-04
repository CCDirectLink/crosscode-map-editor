import {Mesh} from '@babylonjs/core';

interface UV {
	u: number;
	v: number;
}

interface Face {
	v1: UV;
	v2: UV;
	v3: UV;
	v4: UV;
}

export class UvMapper {
	mapUv(mesh: Mesh) {
		mesh.updateFacetData();
		
		const uv = mesh.getVerticesData('uv') || [];
		console.log('uv', uv);
		
		const uvPoints: UV[] = [];
		
		for (let i = 1; i < uv.length; i += 2) {
			const u = uv[i - 1];
			const v = uv[i];
			uvPoints.push({u: u, v: v});
		}
		console.log('uv points', uvPoints);
		
		const uvFaces: Face[] = [];
		
		for (let i = 3; i < uvPoints.length; i += 4) {
			const v1 = uvPoints[i - 3];
			const v2 = uvPoints[i - 2];
			const v3 = uvPoints[i - 1];
			const v4 = uvPoints[i];
			uvFaces.push({v1: v1, v2: v2, v3: v3, v4: v4});
		}
		
		console.log('uv faces', uvFaces);
	}
}
