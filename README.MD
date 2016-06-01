# angular2-hotkeys

## Installation

To install this library, run:

```bash
$ npm install angular2-hotkeys --save
```

## Examples
First, import the HotkeysService and Hotkey model

```typescript
import {HotkeysService, Hotkey} from 'angular2-hotkeys';
```

Then, add HotkeysService to your components providers array

```typescript
@Component({
    selector : 'example',
    providers : [HotkeysService],
})
```
Then inject the service into your constructor and add a new hotkey

```typescript
constructor(private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('meta+shift+g', (event: KeyboardEvent) => {
        console.log('Typed hotkey');
        return false; // Prevent bubbling
    }));
}
```

For more information on what hotkeys can be used, check out <https://craig.is/killing/mice>
This library is a work in progress and any issues/pull-requests are welcomed!
Based off of the[angular-hotkeys library](https://github.com/chieffancypants/angular-hotkeys)

## TODO
1. Automatically generate cheatsheet

## Development

To generate all `*
}.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

## License

MIT © [Nick Richardson](nick.richardson@mediapixeldesign.com)
