// parse entities to map editor readable format

const ig = document.getElementById('frame').contentWindow.ig;
let og = {};
for (const [key, val] of Object.entries(ig.ACTION_STEP)) {
	let wm = val.prototype._wm;
	if (!wm) {
		console.warn(key + ' has no wm property', val.prototype);
		continue;
	}
	let prot = val.prototype;
	prot = JSON.parse(JSON.stringify(prot));
	delete prot._wm;
	delete prot.classId;
	og[key] = wm;
	delete wm._data;
	delete wm.classId;
	wm.initialObject = prot;
}

let out = JSON.parse(JSON.stringify(og));

for (let [key, value] of Object.entries(out)) {
	if (!value.attributes)
		delete out[key]
}

for (let [key, value] of Object.entries(out)) {
	delete value.classId;
	delete value._data;
	
	for (let [key2, attr] of Object.entries(value.attributes)) {
		for (let key3 of Object.keys(attr)) {
			if (key3.startsWith('_')) {
				attr[key3.substr(1)] = attr[key3];
				delete attr[key3];
			}
		}
		
		attr.description = attr.info;
		delete attr.info;
		attr.options = ig.ACTION_STEP[key].prototype._wm.attributes[key2]._select;
		delete attr.select;
		
		
		if (attr.options) {
			const newopt = {};
			for (let optionKey of Object.keys(attr.options)) {
				newopt[optionKey] = 0;
			}
			attr.options = newopt;
		}
	}
}

console.log(out);
copy(JSON.stringify(out));
