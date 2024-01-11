import { Inject, Injectable } from '@angular/core';
import { Hotkey } from './hotkey.model';
import { Subject } from 'rxjs';
import { HotkeyOptions, IHotkeyOptions } from './hotkey.options';
import { MousetrapInstance } from 'mousetrap';
import * as Mousetrap from 'mousetrap';

@Injectable({
    providedIn: 'root'
})
export class HotkeysService {
    hotkeys: Hotkey[] = [];
    pausedHotkeys: Hotkey[] = [];
    mousetrap: MousetrapInstance;
    cheatSheetToggle: Subject<any> = new Subject();

    private preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

    constructor(@Inject(HotkeyOptions) private options: IHotkeyOptions) {
        // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
        Mousetrap.prototype.stopCallback = (event: KeyboardEvent, element: HTMLElement, combo: string, callback: Function) => {
            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }
            return (element.contentEditable && element.contentEditable === 'true');
        };
        this.mousetrap = new (Mousetrap as any).default();
        this.initCheatSheet();
    }

    private initCheatSheet() {
        // Cheat sheet hotkey
        if (!this.options.disableCheatSheet) {
            let opt = {
                combo: this.options.cheatSheetHotkey || '?',
                callback: (_event: KeyboardEvent, _combo: string) => {
                    this.cheatSheetToggle.next(null);
                    return false;
                },
                description: this.options.cheatSheetDescription || 'Show / hide this help menu',
                allowIn: []
            };
            let add: Hotkey | Hotkey[] = new Hotkey(opt.combo, opt.callback.bind(this), opt.allowIn, opt.description);
            this.add(add);
        }
        // Cheat sheet close esc
        if (this.options.cheatSheetCloseEsc) {
            let opt = {
                combo: 'esc',
                callback: (_event: KeyboardEvent, _combo: string) => {
                    this.cheatSheetToggle.next(false);
                    return false;
                },
                description: this.options.cheatSheetCloseEscDescription || 'Hide this help menu',
                allowIn: ['HOTKEYS-CHEATSHEET']
            };
            let add: Hotkey | Hotkey[] = new Hotkey(opt.combo, opt.callback.bind(this), opt.allowIn, opt.description);
            this.add(add);
        }

    }

    add<T extends Hotkey | Hotkey[]>(hotkey: T, specificEvent?: string): T {
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(this.add<Hotkey>(key, specificEvent));
            }
            return temp as T;
        }
        this.remove(hotkey);
        this.hotkeys.push(hotkey as Hotkey);
        this.mousetrap.bind((hotkey as Hotkey).combo, (event: KeyboardEvent, combo: string) => {
            let shouldExecute = true;

            // if the callback is executed directly `hotkey.get('w').callback()`
            // there will be no event, so just execute the callback.
            if (event) {
                const target: HTMLElement = (event.target || event.srcElement) as HTMLElement; // srcElement is IE only
                const nodeName: string = target.nodeName.toUpperCase();

                const allowIn = (hotkey as Hotkey).allowIn || [];

                // check if the input has a mousetrap class, and skip checking preventIn if so
                if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
                    shouldExecute = true;
                } else if (this.preventIn.indexOf(nodeName) > -1 && allowIn.map(allow => allow.toUpperCase()).indexOf(nodeName) === -1) {
                    // don't execute callback if the event was fired from inside an element listed in preventIn but not in allowIn
                    shouldExecute = false;
                }
            }

            if (shouldExecute) {
                return (hotkey as Hotkey).callback.apply(this, [event, combo]);
            }
        }, specificEvent);
        return hotkey;
    }

    remove<T extends Hotkey | Hotkey[]>(hotkey?: T, specificEvent?: string): T | null {
        const temp: Hotkey[] = [];
        if (!hotkey) {
            for (const key of this.hotkeys) {
                temp.push(this.remove(key, specificEvent) as Hotkey);
            }
            return temp as T;
        }
        if (Array.isArray(hotkey)) {
            for (const key of hotkey) {
                temp.push(this.remove(key) as Hotkey);
            }
            return temp as T;
        }
        const index = this.findHotkey(hotkey as Hotkey);
        if (index > -1) {
            this.hotkeys.splice(index, 1);
            this.mousetrap.unbind((hotkey as Hotkey).combo, specificEvent);
            return hotkey;
        }
        return null;
    }

    get<T extends string | string[]>(combo?: T): Hotkey | Hotkey[] | null {
        if (!combo) {
            return this.hotkeys;
        }
        if (Array.isArray(combo)) {
            const temp: Hotkey[] = [];
            for (const key of combo) {
                temp.push(this.get(key) as Hotkey);
            }
            return temp;
        }
        for (const hotkey of this.hotkeys) {
            if (hotkey.combo.indexOf(combo as string) > -1) {
                return hotkey;
            }
        }
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    pause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if (!hotkey) {
            return this.pause(this.hotkeys);
        }
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey.slice()) {
                temp.push(this.pause(key) as Hotkey);
            }
            return temp;
        }
        this.remove(hotkey);
        this.pausedHotkeys.push(hotkey as Hotkey);
        return hotkey;
    }

    // noinspection JSUnusedGlobalSymbols
    unpause<T extends Hotkey | Hotkey[]>(hotkey?: T): T | null {
        if (!hotkey) {
            return this.unpause(this.pausedHotkeys) as T;
        }
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey.slice()) {
                temp.push(this.unpause(key) as Hotkey);
            }
            return temp as T;
        }
        const index: number = this.pausedHotkeys.indexOf(hotkey as Hotkey);
        if (index > -1) {
            this.add(hotkey);
            return this.pausedHotkeys.splice(index, 1) as T;
        }
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    reset() {
        this.mousetrap.reset();
        this.hotkeys = [];
        this.pausedHotkeys = [];
        this.initCheatSheet();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}