// Parse entities to map editor readable format. Copy it into the game console and it will put the result in your clipboard.

{ //Scope is so that you can run the script multiple times without having evil vars in the code
	const STEP_TYPE = ig.EVENT_STEP; //Change this to ig.ACTION_STEP to copy action steps
	
	//const ig = document.getElementById('frame').contentWindow.ig; //Uncomment this for old crosscode versions
	let og = {};
	for (const [key, val] of Object.entries(STEP_TYPE)) {
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
			attr.options = STEP_TYPE[key].prototype._wm.attributes[key2]._select;
			delete attr.select;
			
			
			if (attr.options) {
				const newopt = {};
				let optIterator;

				if(Array.isArray(attr.options)) {
					optIterator = attr.options;
				} else {
					optIterator = Object.keys(attr.options);
				}

				for (let optionKey of optIterator) {
					newopt[optionKey] = 0;
				}
				attr.options = newopt;
			}
		}
	}

	console.log(out);
	copy(JSON.stringify(out));
}