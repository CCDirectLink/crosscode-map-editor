import { Injectable } from '@angular/core';

@Injectable()
export class CharacterNamesService {
	private names: string[];

	constructor() { 
		this.names = ['main.lea'];
	}
  
	/**
	 * Returns all names stored.
	 * @returns {string[]} Character names in the format of "typeOfCharacter.characterAlias"
	 */
	getAllNames(): string[] {
		return this.names;
	}
}
