export type Entries<T> = [string, T[keyof T]][];

/**
 * Uses `Object.keys(obj)`, but adds proper type to the keys
 */
export function getKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

/**
 * Uses `Object.entries(obj)`, but adds proper type to the value object
 */
export function getEntries<T extends object>(obj: T): Entries<T> {
	return Object.entries(obj) as Entries<T>;
}

/**
 * Uses `Object.values(obj)`, but adds proper type to the result
 */
export function getValues<T extends object>(obj: T): T[keyof T][] {
	return Object.values(obj) as T[keyof T][];
}
