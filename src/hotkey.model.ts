export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

export class Hotkey {
    _formatted: string[];

    static symbolize(combo: string): string {
        let map: any = {
            command : '\u2318',       // ⌘
            shift : '\u21E7',         // ⇧
            left : '\u2190',          // ←
            right : '\u2192',         // →
            up : '\u2191',            // ↑
            down : '\u2193',          // ↓
            'return' : '\u23CE',      // ⏎
            backspace : '\u232B'      // ⌫
        };
        let comboSplit: string[] = combo.split('+');

        for (let i = 0; i < comboSplit.length; i++) {
            // try to resolve command / ctrl based on OS:
            if(comboSplit[i] === 'mod') {
                if(window.navigator && window.navigator.platform.indexOf('Mac') >= 0) {
                    comboSplit[i] = 'command';
                } else {
                    comboSplit[i] = 'ctrl';
                }
            }

            comboSplit[i] = map[comboSplit[i]] || comboSplit[i];
        }

        return comboSplit.join(' + ');
    }

    /**
     * Creates a new Hotkey for Mousetrap binding
     *
     * @param {string}   combo       mousetrap key binding
     * @param {string}   description description for the help menu
     * @param {Function} callback    method to call when key is pressed
     * @param {string}   action      the type of event to listen for (for mousetrap)
     * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
     * @param {boolean}  persistent  if true, the binding is preserved upon route changes
     */
    constructor(public combo: string | string[], public callback: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean,
                public allowIn?: string[], public description?: string | Function, public action?: string,
                public persistent?: boolean) {
        this.combo = (Array.isArray(combo) ? combo : [<string>combo]);
        this.allowIn = allowIn || [];
        this.description = description || '';
    }

    get formatted(): string[] {
        if(!this._formatted) {
            let combo: string = this.combo[0];
            let sequence: string[] = combo.split(/[\s]/);
            for (let i = 0; i < sequence.length; i++) {
                sequence[i] = Hotkey.symbolize(sequence[i]);
            }
            this._formatted = sequence;
        }
        return this._formatted;
    }
}
