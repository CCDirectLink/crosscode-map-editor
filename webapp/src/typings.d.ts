declare module '*.json' {
	const value: any;
	export default value;
}

declare namespace Phaser {
	interface Input {
		mouseWheel: Phaser.MouseWheel; //Workaround for missing typings
	}
}