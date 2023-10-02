import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepLabelDropdownComponent } from './keep-label-dropdown.component';

describe('KeepLabelDropdownComponent', () => {
  let component: KeepLabelDropdownComponent;
  let fixture: ComponentFixture<KeepLabelDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepLabelDropdownComponent]
    });
    fixture = TestBed.createComponent(KeepLabelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
