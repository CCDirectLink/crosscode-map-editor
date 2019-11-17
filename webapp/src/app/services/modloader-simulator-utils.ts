/**
 * 
 * @param arr {any}
 */
export function orderByDependencies(arr: any, semver: any) {

	arr = JSON.parse(JSON.stringify(arr));
	arr.forEach((e: any) => {
		const _package = e.package;
		if(!_package.ccmodDependencies) {
			_package.ccmodDependencies = _package.dependencies || {};
		}
		if(!_package.ccmodDependencies) {
			return;
		}
		delete _package.ccmodDependencies['crosscode'];
		delete _package.ccmodDependencies['ccloader'];
	})
	// exclude specific dependencies 

	let depMap = buildDependencyMap(arr);
	checkVersions(depMap, semver);
	disableAllInactive(depMap);
	removeAllInactive(depMap);
	
	for (const [name, value] of depMap) {
		for (const depName in value.dependant) {
			const child = value.dependant[depName];
			child.count += 1;
		}
	}
	// convert it to an array 
	const orderArr = [...depMap].map(e => e[1]);

	orderArr.sort((e, i) => e.count - i.count);
	
	return orderArr.map(e => e.instance);
}

function buildDependencyMap(mods: any) {
	const depMap = new Map();
	for (let mod of mods) {
		if (depMap.has(mod.name)) {
			depMap.get(mod.name).instance = mod;
			depMap.get(mod.name).active = true;
		} else {
			depMap.set(mod.name, {
				instance: mod,
				dependant: {},
				count: 0,
				active: true
			});			
		}
		const _package = mod.package;
		if (!_package.ccmodDependencies) {
			continue;
		}
		for(const depName of Object.keys(_package.ccmodDependencies)) {
			if (!depMap.has(depName)) {
				depMap.set(depName, {
					instance: null,
					dependant: {},
					count: 0,
					active: false
				});
			}
			depMap.get(depName).dependant[mod.name] = depMap.get(mod.name);
		}
	}
	return depMap;
}

function checkVersions(depMap: any, semver: any) {
	for(const [name, value] of depMap) {
		const instance = value.instance;
		if (!instance) {
			value.active = false;
		}
		
		if (!value.active) {
			continue;
		}
		for (const dependantName in value.dependant) {
			const dependency = value.dependant[dependantName];
			const depInstance = dependency.instance;
			if (!depInstance) {
				continue;
			}
			const version = instance.package.version || '';
			const ccmodDependencies = depInstance.package.ccmodDependencies || {};
			const versionToCheck = ccmodDependencies[name];
			if (!semver.satisfies(version || '', versionToCheck)) {
				dependency.active = false;
			}
		}
	}
	return depMap;
}

function disableAllInactive(depMap: any) {
	for (const [name, value] of depMap) {
		if (!value.active) {
			_disableAllInactive(value);
		}
	}
	return depMap;
}

function _disableAllInactive(value: any) {
	for (const depName in value.dependant) {
		const child = value.dependant[depName];
		child.active = false;
		_disableAllInactive(child);
	}
}

function removeAllInactive(depMap: any) {
	const toRemove = [];
	for (const [name, value] of depMap) {
		if (!value.active) {
			toRemove.push(name);
		}
	}
	for (const depToRemove of toRemove) {
		depMap.delete(depToRemove);
	}
	return depMap;
}
