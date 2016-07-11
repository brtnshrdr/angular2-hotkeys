import {Injectable} from '@angular/core';
import {Hotkey} from '../models/hotkey.model';
import 'mousetrap';

@Injectable()
export class HotkeysService {
    hotkeys: Hotkey[] = [];
    pausedHotkeys: Hotkey[] = [];
    mousetrap: MousetrapInstance;

    private _preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

    constructor() {
        Mousetrap.prototype.stopCallback = (event: KeyboardEvent, element: HTMLElement, combo: string, callback: Function) => {
            // if the element has the class "mousetrap" then no need to stop
            if((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }
            return (element.contentEditable && element.contentEditable == 'true');
        };
        this.mousetrap = new (<any>Mousetrap)();
    }

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
        this.mousetrap.bind((<Hotkey>hotkey).combo, (event: KeyboardEvent, combo: string) => {
            let shouldExecute = true;

            // if the callback is executed directly `hotkey.get('w').callback()`
            // there will be no event, so just execute the callback.
            if(event) {
                let target: HTMLElement = <HTMLElement>(event.target || event.srcElement); // srcElement is IE only
                let nodeName: string = target.nodeName.toUpperCase();

                // check if the input has a mousetrap class, and skip checking preventIn if so
                if((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
                    shouldExecute = true;
                } else if(this._preventIn.indexOf(nodeName) > -1 && (<Hotkey>hotkey).allowIn.indexOf(nodeName) === -1) {
                    // don't execute callback if the event was fired from inside an element listed in preventIn but not in allowIn
                    shouldExecute = false;
                }
            }

            if(shouldExecute) {
                return (<Hotkey>hotkey).callback.apply(this, [event, combo]);
            }
        });
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
            this.hotkeys.splice(index, 1);
            this.mousetrap.unbind((<Hotkey>hotkey).combo);
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
        if(!hotkey) {
            return this.unpause(this.pausedHotkeys);
        }
        if(Array.isArray(hotkey)) {
            let temp: Hotkey[] = [];
            for (let key of hotkey) {
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
        this.mousetrap.reset();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}
