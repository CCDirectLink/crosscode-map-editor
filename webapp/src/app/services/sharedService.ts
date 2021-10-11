export interface SharedService {
    saveModSelect(mod: string): Promise<void>;
    getSelectedMod(): string;
	
    relaunch(): void;
}
