import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Hotkeys} from './src/directives/hotkeys.directive';
import {HotkeysService} from './src/services/hotkeys.service';


export * from './src/directives/hotkeys.directive';
export * from './src/services/hotkeys.service';
export * from './src/models/hotkey.model';

@NgModule({
    imports : [CommonModule],
    exports : [Hotkeys],
    declarations : [Hotkeys]
})
export class HotkeyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule : HotkeyModule,
            providers : [HotkeysService]
        };
    }
}
