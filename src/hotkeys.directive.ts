import {Directive, Input, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {Hotkey, ExtendedKeyboardEvent} from './hotkey.model';
import {HotkeysService} from './hotkeys.service';
import 'mousetrap';

@Directive({
    selector : '[hotkeys]',
    providers : [HotkeysService]
})
export class HotkeysDirective implements OnInit, OnDestroy {
    @Input() hotkeys: {[combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent}[];

    private mousetrap: MousetrapInstance;
    private hotkeysList: Hotkey[] = [];
    private oldHotkeys: Hotkey[] = [];

    constructor(private _hotkeysService: HotkeysService, private _elementRef: ElementRef) {
        this.mousetrap = new Mousetrap(this._elementRef.nativeElement); // Bind hotkeys to the current element (and any children)
    }

    ngOnInit() {
        for (let hotkey of this.hotkeys) {
            let combo = Object.keys(hotkey)[0];
            let hotkeyObj: Hotkey = new Hotkey(combo, hotkey[combo]);
            let oldHotkey: Hotkey = <Hotkey>this._hotkeysService.get(combo);
            if(oldHotkey !== null) { // We let the user overwrite callbacks temporarily if you specify it in HTML
                this.oldHotkeys.push(oldHotkey);
                this._hotkeysService.remove(oldHotkey);
            }
            this.hotkeysList.push(hotkeyObj);
            this.mousetrap.bind(hotkeyObj.combo, hotkeyObj.callback);
        }
    }

    ngOnDestroy() {
        for (let hotkey of this.hotkeysList) {
            this.mousetrap.unbind(hotkey.combo);
        }
        this._hotkeysService.add(this.oldHotkeys);
    }

}























