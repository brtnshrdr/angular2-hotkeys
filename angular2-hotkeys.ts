import { HotkeyOptions, IHotkeyOptions } from './src/models/hotkey.options';
import { CheatSheetComponent } from './src/directives/cheatsheet.component';
import { ModuleWithProviders, NgModule, OpaqueToken } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Hotkeys} from './src/directives/hotkeys.directive';
import {HotkeysService} from './src/services/hotkeys.service';


export * from './src/directives/cheatsheet.component';
export * from './src/directives/hotkeys.directive';
export * from './src/services/hotkeys.service';
export * from './src/models/hotkey.model';

export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

@NgModule({
    imports : [CommonModule],
    exports : [Hotkeys, CheatSheetComponent],
    declarations : [Hotkeys, CheatSheetComponent]
})
export class HotkeyModule {
    static forRoot(options: IHotkeyOptions = {}): ModuleWithProviders {
        return {
            ngModule : HotkeyModule,
            providers : [
                HotkeysService,
                { provide: HotkeyOptions, useValue: options }
            ]
        };
    }
}
