import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HotkeysCheatsheetComponent } from './hotkeys-cheatsheet.component';

describe('HotkeysCheatsheetComponent', () => {
    let component: HotkeysCheatsheetComponent;
    let fixture: ComponentFixture<HotkeysCheatsheetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
    imports: [HotkeysCheatsheetComponent]
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HotkeysCheatsheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
