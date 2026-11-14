export class DirectoryHandleCache {
	
	private readonly cache = new Map<string, Promise<FileSystemDirectoryHandle>>();
	
	constructor(private readonly root: FileSystemDirectoryHandle) {
	}
	
	get(path: string): Promise<FileSystemDirectoryHandle> {
		let dir = Promise.resolve(this.root);
		let dirPath = '';
		for (const name of path.split('/').filter(Boolean)) {
			dirPath += `/${name}`;
			dir = this.getChild(dir, dirPath, name);
		}
		return dir;
	}
	
	// caches the promise, so simultaneous lookups share one request
	private getChild(parent: Promise<FileSystemDirectoryHandle>, path: string, name: string) {
		let child = this.cache.get(path);
		if (!child) {
			child = parent.then(dir => dir.getDirectoryHandle(name));
			// a missing folder stays cached, mods are asked for every asset but replace only a few.
			// Other failures (e.g. access not granted yet) have to be retried
			child.catch(e => {
				if (!(e instanceof DOMException && e.name === 'NotFoundError')) {
					this.cache.delete(path);
				}
			});
			this.cache.set(path, child);
		}
		return child;
	}
}
