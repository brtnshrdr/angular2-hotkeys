import {Injectable} from '@angular/core';
import {Hotkey} from '../models/hotkey.model';
import 'mousetrap';

@Injectable()
export class HotkeysService {
    hotkeys: Hotkey[] = [];

    pausedHotkeys: Hotkey[] = [];

    addHotkey(hotkey: Hotkey): Hotkey {
        this.removeHotkey(hotkey);
        this.hotkeys.push(hotkey);
        Mousetrap.bind(hotkey.combo, hotkey.callback);
        return hotkey;
    }

    removeHotkey(hotkey: Hotkey): Hotkey {
        let index = this.findHotkey(hotkey);
        console.log('Index: ' + index);
        if(index > -1) {
            this.hotkeys.slice(index, 1);
            Mousetrap.unbind(hotkey.combo);
            return hotkey;
        }
        return null;
    }

    getHotkey(combo: string): Hotkey {
        for (let i = 0; i < this.hotkeys.length; i++) {
            if(this.hotkeys[i].combo === combo) {
                return this.hotkeys[i];
            }
        }
        return null;
    }

    pause(hotkeys?: Hotkey[]) {
        if(hotkeys) {
            for (let i = 0; i < hotkeys.length; i++) {
                let h = this.removeHotkey(hotkeys[i]);
                if(h !== null) {
                    this.pausedHotkeys.push(h);
                }
            }
        } else {
            this.pause(this.hotkeys);
        }
    }

    unpause(hotkeys?: Hotkey[]) {
        if(hotkeys) {
            for (let i = 0; i < hotkeys.length; i++) {
                let index: number = this.pausedHotkeys.indexOf(hotkeys[i]);
                if(index > -1) {
                    this.addHotkey(hotkeys[i]);
                    this.pausedHotkeys.splice(i, 1);
                }
            }
        } else {
            for (let i = 0; i < this.pausedHotkeys.length; i++) {
                this.addHotkey(this.pausedHotkeys[i]);
            }
            this.pausedHotkeys = [];
        }
    }

    reset() {
        Mousetrap.reset();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}