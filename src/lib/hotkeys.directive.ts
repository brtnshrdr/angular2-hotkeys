import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Hotkey } from './hotkey.model';
import { HotkeysService } from './hotkeys.service';
import { MousetrapInstance } from 'mousetrap';
import * as Mousetrap from 'mousetrap';
import { ExtendedKeyboardEvent } from './hotkey.interfaces-types';

type HotkeyMap = { [combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent }[];

@Directive({
    selector: '[hotkeys]',
    providers: [HotkeysService],
    standalone: true
})
export class HotkeysDirective implements OnInit, OnDestroy {
    @Input()
    hotkeys: HotkeyMap = [];

    private mousetrap: MousetrapInstance;
    private hotkeysList: Hotkey[] = [];
    private oldHotkeys: Hotkey[] = [];

    constructor(private hotkeysService: HotkeysService, private elementRef: ElementRef) {
        // Bind hotkeys to the current element (and any children)
        this.mousetrap = new (Mousetrap as any).default(this.elementRef.nativeElement);
    }

    ngOnInit() {
        for (const hotkey of this.hotkeys) {
            const combo = Object.keys(hotkey)[0];
            const hotkeyObj: Hotkey = new Hotkey(combo, hotkey[combo]);
            const oldHotkey: Hotkey = this.hotkeysService.get(combo) as Hotkey;
            if (oldHotkey !== null) { // We let the user overwrite callbacks temporarily if you specify it in HTML
                this.oldHotkeys.push(oldHotkey);
                this.hotkeysService.remove(oldHotkey);
            }
            this.hotkeysList.push(hotkeyObj);
            this.mousetrap.bind(hotkeyObj.combo, hotkeyObj.callback);
        }
    }

    ngOnDestroy() {
        for (const hotkey of this.hotkeysList) {
            this.mousetrap.unbind(hotkey.combo);
        }
        this.hotkeysService.add(this.oldHotkeys);
    }

}
