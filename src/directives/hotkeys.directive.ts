import {Directive, Input, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {Hotkey} from '../models/hotkey.model';
import {HotkeysService} from '../services/hotkeys.service';
import 'mousetrap';

@Directive({
    selector : '[hotkeys]',
    providers : [HotkeysService]
})
export class Hotkeys implements OnInit, OnDestroy {
    @Input('hotkeys') hotkeysInput: Array<{[combo: string]: (event: KeyboardEvent) => ExtendedKeyboardEvent}>;

    mousetrap: MousetrapInstance;
    hotkeys: Hotkey[] = [];
    oldHotkeys: Hotkey[] = [];

    constructor(private _hotkeysService: HotkeysService, private _elementRef: ElementRef) {
        this.mousetrap = new Mousetrap(this._elementRef.nativeElement); // Bind hotkeys to the current element (and any children)
        console.log('Created hotkey instance');
        console.dir(this.mousetrap);
    }

    ngOnInit() {
        for (let hotkey of this.hotkeysInput) {
            let combo = Object.keys(hotkey)[0];
            let hotkeyObj: Hotkey = new Hotkey(combo, hotkey[combo]);
            let oldHotkey: Hotkey = <Hotkey>this._hotkeysService.get(combo);
            if(oldHotkey !== null){ // We let the user overwrite callbacks temporarily if you specify it in HTML
                this.oldHotkeys.push(oldHotkey);
                this._hotkeysService.remove(oldHotkey);
            }
            this.hotkeys.push(hotkeyObj);
            this.mousetrap.bind(hotkeyObj.combo, hotkeyObj.callback);
        }
    }

    ngOnDestroy() {
        this.mousetrap.unbind(this.hotkeys.map(hotkey => hotkey.combo));
        this._hotkeysService.add(this.oldHotkeys);
    }

}























