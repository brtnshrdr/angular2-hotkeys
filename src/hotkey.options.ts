import {InjectionToken} from '@angular/core';

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
     * Description for the cheat sheet hot key in the cheat sheet. Default: 'Show / hide this help menu'
     */
    cheatSheetDescription?: string;
}

export const HotkeyOptions = new InjectionToken<IHotkeyOptions>('HotkeyOptions');
