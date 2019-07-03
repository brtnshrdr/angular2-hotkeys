import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HotkeysDirective} from './hotkeys.directive';
import {CheatSheetComponent} from './cheatsheet.component';
import {IHotkeyOptions, HotkeyOptions} from './hotkey.options';
import {HotkeysService} from './hotkeys.service';

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