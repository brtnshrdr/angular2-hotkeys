import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HotkeysDirective} from './src/hotkeys.directive';
import {CheatSheetComponent} from './src/cheatsheet.component';
import {IHotkeyOptions, HotkeyOptions} from './src/hotkey.options';
import {HotkeysService} from './src/hotkeys.service';

export * from './src/cheatsheet.component';
export * from './src/hotkey.model';
export * from './src/hotkey.options';
export * from './src/hotkeys.directive';
export * from './src/hotkeys.service';

@NgModule({
    imports : [CommonModule],
    exports : [HotkeysDirective, CheatSheetComponent],
    declarations : [HotkeysDirective, CheatSheetComponent]
})
export class HotkeyModule {
    static forRoot(options: IHotkeyOptions = {}): ModuleWithProviders {
        return {
            ngModule : HotkeyModule,
            providers : [
                HotkeysService,
                {provide : HotkeyOptions, useValue : options}
            ]
        };
    }
}