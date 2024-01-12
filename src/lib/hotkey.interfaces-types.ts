import { InjectionToken } from '@angular/core';

export const HotkeyOptions = new InjectionToken<IHotkeyOptions>('HotkeyOptions');

export interface IHotkeyOptions {
    /**
     * Disable the cheat sheet popover dialog? Default: false
     */
    disableCheatSheet?: boolean;
    /**
     * Key combination to trigger the cheat sheet. Default: '?'
     */
    cheatSheetHotkey?: string;

    /**
     * Use also ESC for closing the cheat sheet. Default: false
     */
    cheatSheetCloseEsc?: boolean;
    /**
     * Description for the ESC key for closing the cheat sheet (if enabed). Default: 'Hide this help menu'
     */
    cheatSheetCloseEscDescription?: string;
    /**
     * Description for the cheat sheet hot key in the cheat sheet. Default: 'Show / hide this help menu'
     */
    cheatSheetDescription?: string;
}

export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

export type HotkeyMap = { [combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent }[];
