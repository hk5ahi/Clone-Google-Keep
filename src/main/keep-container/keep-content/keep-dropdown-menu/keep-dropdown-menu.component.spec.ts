import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepDropdownMenuComponent } from './keep-dropdown-menu.component';

describe('KeepDropdownMenuComponent', () => {
  let component: KeepDropdownMenuComponent;
  let fixture: ComponentFixture<KeepDropdownMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepDropdownMenuComponent]
    });
    fixture = TestBed.createComponent(KeepDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
