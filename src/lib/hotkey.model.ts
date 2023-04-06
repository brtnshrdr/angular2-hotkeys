export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

export class Hotkey {
    private formattedHotkey: string[];

    static symbolize(combo: string): string {
        const map: any = {
            command: '\u2318',       // ⌘
            shift: '\u21E7',         // ⇧
            left: '\u2190',          // ←
            right: '\u2192',         // →
            up: '\u2191',            // ↑
            down: '\u2193',          // ↓
            // tslint:disable-next-line:object-literal-key-quotes
            'return': '\u23CE',      // ⏎
            backspace: '\u232B'      // ⌫
        };
        const comboSplit: string[] = combo.split('+');

        for (let i = 0; i < comboSplit.length; i++) {
            // try to resolve command / ctrl based on OS:
            if (comboSplit[i] === 'mod') {
                if (window.navigator && window.navigator.platform.indexOf('Mac') >= 0) {
                    comboSplit[i] = 'command';
                } else {
                    comboSplit[i] = 'ctrl';
                }
            }

            comboSplit[i] = map[comboSplit[i]] || comboSplit[i];
        }

        return comboSplit.join(' + ');
    }
    
    public combo: string[];

    /**
     * Creates a new Hotkey for Mousetrap binding
     *
     * @param combo       mousetrap key binding
     * @param description description for the help menu
     * @param callback    method to call when key is pressed
     * @param action      the type of event to listen for (for mousetrap)
     * @param allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
     * @param persistent  if true, the binding is preserved upon route changes
     */
    constructor(combo: string | string[], public callback: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean,
                public allowIn?: string[], public description?: string | Function, public action?: string,
                public persistent?: boolean) {
        this.combo = (Array.isArray(combo) ? combo : [combo as string]);
        this.allowIn = allowIn || [];
        this.description = description || '';
    }

    get formatted(): string[] {
      return (this.formattedHotkey ??= this.combo.map(Hotkey.symbolize));
    }
}
