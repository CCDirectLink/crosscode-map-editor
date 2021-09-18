export interface SharedService {
    saveModSelect(mod: string): Promise<void>;
    getSelectedMod(): string;
	
	saveWrap (wrap: boolean): void;
	getWrap (): boolean;
    
    relaunch(): void;
}
