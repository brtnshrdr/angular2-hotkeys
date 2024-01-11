import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Hotkey } from '../hotkey.model';
import { HotkeysService } from '../hotkeys.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'hotkeys-cheatsheet',
    templateUrl: './hotkeys-cheatsheet.component.html',
    styleUrls: ['./hotkeys-cheatsheet.component.css']
})
export class HotkeysCheatsheetComponent implements OnInit, OnDestroy {
    helpVisible$ = new BehaviorSubject(false);
    @Input() title = 'Keyboard Shortcuts:';
    subscription: Subscription = new Subscription();

    hotkeys: Hotkey[] = [];

    constructor(private hotkeysService: HotkeysService) {
    }

    public ngOnInit(): void {
        this.subscription = this.hotkeysService.cheatSheetToggle.subscribe((isOpen) => {
            if (isOpen !== false) {
                this.hotkeys = this.hotkeysService.hotkeys.filter(hotkey => hotkey.description);
            }

            if (isOpen === false) {
                this.helpVisible$.next(false);
            } else {
                this.toggleCheatSheet();
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public toggleCheatSheet(): void {
        this.helpVisible$.next(!this.helpVisible$.value);
    }
}
