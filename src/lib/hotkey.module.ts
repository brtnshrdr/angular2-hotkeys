import { ModuleWithProviders, NgModule } from '@angular/core';
import { HotkeysDirective } from './hotkeys.directive';
import { HotkeysCheatsheetComponent } from './hotkeys-cheatsheet/hotkeys-cheatsheet.component';
import { CommonModule } from '@angular/common';
import { HotkeyOptions, IHotkeyOptions } from './hotkey.options';
import { HotkeysService } from './hotkeys.service';

@NgModule({
    declarations: [HotkeysDirective, HotkeysCheatsheetComponent],
    imports: [CommonModule],
    exports: [HotkeysDirective, HotkeysCheatsheetComponent]
})
export class HotkeyModule {
    // noinspection JSUnusedGlobalSymbols
    static forRoot(options: IHotkeyOptions = {}): ModuleWithProviders<HotkeyModule> {
        return {
            ngModule : HotkeyModule,
            providers : [
                HotkeysService,
                {provide : HotkeyOptions, useValue : options}
            ]
        };
    }
}
