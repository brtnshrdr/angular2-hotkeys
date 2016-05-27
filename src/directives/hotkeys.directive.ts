import {Directive, Input, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {Hotkey} from '../models/hotkey.model';
import {HotkeysService} from '../services/hotkeys.service';
import 'mousetrap';

@Directive({
    selector : '[hotkeys]',
    providers : [HotkeysService]
})
export class Hotkeys implements OnInit, OnDestroy {
    @Input('hotkeys') hotkeysInput: Array<{[combo: string]: Function}>;

    mousetrap: MousetrapInstance;
    hotkeys: Hotkey[] = [];
    oldHotkeys: Hotkey[] = [];

    constructor(private _hotkeysService: HotkeysService, private _elementRef: ElementRef) {
        this.mousetrap = new Mousetrap(this._elementRef.nativeElement); // Bind hotkeys to the current element (and any children)
        console.log('Created hotkey instance');
        console.dir(this.mousetrap);
    }

    ngOnInit() {
        for (let i = 0; i < this.hotkeysInput.length; i++) {
            let key = Object.keys(this.hotkeysInput[i])[0];
            let hotkey: Hotkey = new Hotkey(key, this.hotkeysInput[i][key]);
            let oldHotkey: Hotkey = this._hotkeysService.getHotkey(key);
            if(oldHotkey !== null){ // We let the user overwrite callbacks temporarily if you specify it in HTML
                this.oldHotkeys.push(oldHotkey);
                this._hotkeysService.removeHotkey(oldHotkey);
            }
            this.hotkeys.push(hotkey);
            this.mousetrap.bind(hotkey.combo, hotkey.callback);
        }
        console.log('now');

    }

    ngOnDestroy() {
        for (let i = 0; i < this.hotkeysInput.length; i++) {
            this.mousetrap.unbind(this.hotkeys[i].combo);
        }
        for (let i = 0; i < this.oldHotkeys.length; i++) {
            this._hotkeysService.addHotkey(this.oldHotkeys[i]); // Add the old hotkeys back after we destroy the current ones
        }

    }

}























