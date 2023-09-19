import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepSideBarComponent } from './keep-side-bar.component';

describe('KeepSideBarComponent', () => {
  let component: KeepSideBarComponent;
  let fixture: ComponentFixture<KeepSideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepSideBarComponent]
    });
    fixture = TestBed.createComponent(KeepSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
