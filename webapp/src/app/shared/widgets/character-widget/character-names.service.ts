import { Injectable } from '@angular/core';

@Injectable()
export class CharacterNamesService {
  /** @member {string[]} names */
  private names: string[];

  constructor() { 
    this.names = ["main.lea"];
  }
  
  /**
   * Returns all names stored.
   * @returns {string[]} Array of Character Names
   */
  getAll() : string[] {
    return this.names;
  }
}
