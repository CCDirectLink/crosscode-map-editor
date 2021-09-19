export interface SharedService {
    saveModSelect(mod: string): Promise<void>;
    getSelectedMod(): string;
	
	saveWrapEventEditorLinesSetting(wrap: boolean): void;
	getWrapEventEditorLinesSetting(): boolean;
    
    relaunch(): void;
}
