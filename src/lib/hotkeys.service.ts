import { Inject, Injectable } from '@angular/core';
import { Hotkey } from './hotkey.model';
import { Subject } from 'rxjs';
import { HotkeyOptions, IHotkeyOptions } from './hotkey.options';
import { MousetrapInstance} from 'mousetrap';
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
        this.mousetrap = new (Mousetrap as any)();
        if (!this.options.disableCheatSheet) {
            this.add(new Hotkey(
                this.options.cheatSheetHotkey || '?',
                function(_: KeyboardEvent) {
                    this.cheatSheetToggle.next();
                }.bind(this),
                [],
                this.options.cheatSheetDescription || 'Show / hide this help menu',
            ));
        }

        if (this.options.cheatSheetCloseEsc) {
            this.add(new Hotkey(
                'esc',
                function(_: KeyboardEvent) {
                    this.cheatSheetToggle.next(false);
                }.bind(this),
                ['HOTKEYS-CHEATSHEET'],
                this.options.cheatSheetCloseEscDescription || 'Hide this help menu',
            ));
        }

    }

    add(hotkey: Hotkey | Hotkey[], specificEvent?: string): Hotkey | Hotkey[] {
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(this.add(key, specificEvent) as Hotkey);
            }
            return temp;
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

                // check if the input has a mousetrap class, and skip checking preventIn if so
                if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
                    shouldExecute = true;
                } else if (this.preventIn.indexOf(nodeName) > -1 &&
                    (hotkey as Hotkey).allowIn.map(allow => allow.toUpperCase()).indexOf(nodeName) === -1) {
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

    remove(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        const temp: Hotkey[] = [];
        if (!hotkey) {
            for (const key of this.hotkeys) {
                temp.push(this.remove(key) as Hotkey);
            }
            return temp;
        }
        if (Array.isArray(hotkey)) {
            for (const key of hotkey) {
                temp.push(this.remove(key) as Hotkey);
            }
            return temp;
        }
        const index = this.findHotkey(hotkey as Hotkey);
        if (index > -1) {
            this.hotkeys.splice(index, 1);
            this.mousetrap.unbind((hotkey as Hotkey).combo);
            return hotkey;
        }
        return null;
    }

    get(combo?: string | string[]): Hotkey | Hotkey[] {
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
            for (const key of hotkey) {
                temp.push(this.pause(key) as Hotkey);
            }
            return temp;
        }
        this.remove(hotkey);
        this.pausedHotkeys.push(hotkey as Hotkey);
        return hotkey;
    }

    // noinspection JSUnusedGlobalSymbols
    unpause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if (!hotkey) {
            return this.unpause(this.pausedHotkeys);
        }
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(this.unpause(key) as Hotkey);
            }
            return temp;
        }
        const index: number = this.pausedHotkeys.indexOf(hotkey as Hotkey);
        if (index > -1) {
            this.add(hotkey);
            return this.pausedHotkeys.splice(index, 1);
        }
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    reset() {
        this.mousetrap.reset();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}

