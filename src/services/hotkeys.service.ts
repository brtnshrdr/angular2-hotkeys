import {Injectable} from '@angular/core';
import {Hotkey} from '../models/hotkey.model';
import 'mousetrap';

@Injectable()
export class HotkeysService {
    hotkeys: Hotkey[] = [];
    pausedHotkeys: Hotkey[] = [];

    add(hotkey: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if(Array.isArray(hotkey)) {
            let temp: Hotkey[] = [];
            for (let key of hotkey) {
                temp.push(<Hotkey>this.add(key));
            }
            return temp;
        }
        this.remove(hotkey);
        this.hotkeys.push(<Hotkey>hotkey);
        Mousetrap.bind((<Hotkey>hotkey).combo, (<Hotkey>hotkey).callback);
        return hotkey;
    }

    remove(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        let temp: Hotkey[] = [];
        if(!hotkey) {
            for (let key of this.hotkeys) {
                temp.push(<Hotkey>this.remove(key));
            }
            return temp;
        }
        if(Array.isArray(hotkey)) {
            for (let key of hotkey) {
                temp.push(<Hotkey>this.remove(key));
            }
            return temp;
        }
        let index = this.findHotkey(<Hotkey>hotkey);
        if(index > -1) {
            this.hotkeys.slice(index, 1);
            Mousetrap.unbind((<Hotkey>hotkey).combo);
            return hotkey;
        }
        return null;
    }

    get(combo?: string | string[]): Hotkey | Hotkey[] {
        if(!combo) {
            return this.hotkeys;
        }
        if(Array.isArray(combo)) {
            let temp: Hotkey[] = [];
            for (let key of combo) {
                temp.push(<Hotkey>this.get(key));
            }
            return temp;
        }
        for (let i = 0; i < this.hotkeys.length; i++) {
            if(this.hotkeys[i].combo === combo) {
                return this.hotkeys[i];
            }
        }
        return null;
    }

    pause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if(!hotkey) {
            return this.pause(this.hotkeys);
        }
        if(Array.isArray(hotkey)) {
            let temp: Hotkey[] = [];
            for (let key of hotkey) {
                temp.push(<Hotkey>this.pause(key));
            }
            return temp;
        }
        this.remove(hotkey);
        this.pausedHotkeys.push(<Hotkey>hotkey);
        return hotkey;
    }

    unpause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if(!hotkey){
            return this.unpause(this.pausedHotkeys);
        }
        if(Array.isArray(hotkey)){
            let temp: Hotkey[] = [];
            for(let key of hotkey){
                temp.push(<Hotkey>this.unpause(key));
            }
            return temp;
        }
        let index: number = this.pausedHotkeys.indexOf(<Hotkey>hotkey);
        if(index > -1) {
            this.add(hotkey);
            this.pausedHotkeys.splice(index, 1);
        }
    }

    reset() {
        Mousetrap.reset();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}