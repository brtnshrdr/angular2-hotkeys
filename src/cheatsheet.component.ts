import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subscription} from 'rxjs';
import {HotkeysService} from './hotkeys.service';
import {Hotkey} from './hotkey.model';

@Component({
    selector : 'hotkeys-cheatsheet',
    styles : [`
.cfp-hotkeys-container {
  display: table !important;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: #333;
  font-size: 1em;
  background-color: rgba(255,255,255,0.9);
}

.cfp-hotkeys-container.fade {
  z-index: -1024;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 0.15s linear;
  -moz-transition: opacity 0.15s linear;
  -o-transition: opacity 0.15s linear;
  transition: opacity 0.15s linear;
}

.cfp-hotkeys-container.fade.in {
  z-index: 10002;
  visibility: visible;
  opacity: 1;
}

.cfp-hotkeys-title {
  font-weight: bold;
  text-align: center;
  font-size: 1.2em;
}

.cfp-hotkeys {
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
}

.cfp-hotkeys table {
  margin: auto;
  color: #333;
}

.cfp-content {
  display: table-cell;
  vertical-align: middle;
}

.cfp-hotkeys-keys {
  padding: 5px;
  text-align: right;
}

.cfp-hotkeys-key {
  display: inline-block;
  color: #fff;
  background-color: #333;
  border: 1px solid #333;
  border-radius: 5px;
  text-align: center;
  margin-right: 5px;
  box-shadow: inset 0 1px 0 #666, 0 1px 0 #bbb;
  padding: 5px 9px;
  font-size: 1em;
}

.cfp-hotkeys-text {
  padding-left: 10px;
  font-size: 1em;
}

.cfp-hotkeys-close {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 2em;
  font-weight: bold;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 45px;
  min-width: 45px;
  text-align: center;
}

.cfp-hotkeys-close:hover {
  background-color: #fff;
  cursor: pointer;
}

@media all and (max-width: 500px) {
  .cfp-hotkeys {
    font-size: 0.8em;
  }
}

@media all and (min-width: 750px) {
  .cfp-hotkeys {
    font-size: 1.2em;
  }
}  `],
    template : `<div class="cfp-hotkeys-container fade" [ngClass]="{'in': helpVisible}" style="display:none"><div class="cfp-hotkeys">
  <h4 class="cfp-hotkeys-title">{{ title }}</h4>
  <table><tbody>
    <tr *ngFor="let hotkey of hotkeys">
      <td class="cfp-hotkeys-keys">
        <span *ngFor="let key of hotkey.formatted" class="cfp-hotkeys-key">{{ key }}</span>
      </td>
      <td class="cfp-hotkeys-text">{{ hotkey.description }}</td>
    </tr>
  </tbody></table>
  <div class="cfp-hotkeys-close" (click)="toggleCheatSheet()">&#215;</div>
</div></div>`,
})
export class CheatSheetComponent implements OnInit, OnDestroy {
    helpVisible = false;
    @Input() title: string = 'Keyboard Shortcuts:';
    subscription: Subscription;

    hotkeys: Hotkey[];

    constructor(private hotkeysService: HotkeysService) {
    }

    public ngOnInit(): void {
        this.subscription = this.hotkeysService.cheatSheetToggle.subscribe((isOpen) => {
            if(isOpen !== false) {
                this.hotkeys = this.hotkeysService.hotkeys.filter(hotkey => hotkey.description);
            }

            if(isOpen === false) {
                this.helpVisible = false;
            } else {
                this.toggleCheatSheet();
            }
        });
    }

    public ngOnDestroy(): void {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public toggleCheatSheet(): void {
        this.helpVisible = !this.helpVisible;
    }
}
