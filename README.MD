# angular2-hotkeys
Angular 2.2.x Compatible
## Installation

To install this library, run:

```bash
$ npm install angular2-hotkeys --save
```

## Examples
First, import the HotkeyModule into your root AppModule

```typescript
import {HotkeyModule} from 'angular2-hotkeys';
```

Then, add HotkeyModule.forRoot() to your AppModule's import array

```typescript
@NgModule({
    imports : [CommonModule, HotkeyModule.forRoot(), ...],
})
export class AppModule {}
```

If you have any sub/feature modules that also use hotkeys, import the HotkeyModule (but NOT .forRoot())
```typescript
@NgModule({
    imports : [CommonModule, HotkeyModule, ...],
})
export class SharedModule {}
```

Then inject the service into your constructor and add a new hotkey

```typescript
constructor(private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('meta+shift+g', (event: KeyboardEvent): boolean => {
        console.log('Typed hotkey');
        return false; // Prevent bubbling
    }));
}
```
It also handles passing an array of hotkey combinations for a single callback
```typescript
this._hotkeysService.add(new Hotkey(['meta+shift+g', 'alt+shift+s'], (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
    console.log('Combo: ' + combo); // 'Combo: meta+shift+g' or 'Combo: alt+shift+s'
    let e: ExtendedKeyboardEvent = event;
    e.returnValue = false; // Prevent bubbling
    return e;
}));
```

Your callback must return either a boolean or an "ExtendedKeyboardEvent".

For more information on what hotkeys can be used, check out <https://craig.is/killing/mice>

This library is a work in progress and any issues/pull-requests are welcomed!
Based off of the [angular-hotkeys library](https://github.com/chieffancypants/angular-hotkeys)

## Cheat Sheet

To enable the cheat sheet, simply add `<hotkeys-cheatsheet></hotkeys-cheatsheet>` to your top level component template.
The `HotkeysService` will automatically register the `?` key combo to toggle the cheat sheet.

### Cheat Sheet Customization

1. You can now pass in custom options in `HotkeysModule.forRoot(options: IHotkeyOptions)`.

```typescript
export interface IHotkeyOptions {
  /**
   * Disable the cheat sheet popover dialog? Default: false
   */
  disableCheatSheet?: boolean;
  /**
   * Key combination to trigger the cheat sheet. Default: '?'
   */
  cheatSheetHotkey?: string;
  /**
   * Description for the cheat sheet hot key in the cheat sheet. Default: 'Show / hide this help menu'
   */
  cheatSheetDescription?: string;
};
```

2. You can also customize the title of the cheat sheet component.

```html
<hotkeys-cheatsheet title="Hotkeys Rock!"></hotkeys-cheatsheet>
<!-- Default: 'Keyboard Shortcuts:' -->
```

## TODO
1. Create unit and E2E tests

## Development

To generate all `*
}.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

## License

MIT © [Nick Richardson](nick.richardson@mediapixeldesign.com)
