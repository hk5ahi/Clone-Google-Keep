import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepLabelModalComponent } from './keep-label-modal.component';

describe('KeepLabelModalComponent', () => {
  let component: KeepLabelModalComponent;
  let fixture: ComponentFixture<KeepLabelModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepLabelModalComponent]
    });
    fixture = TestBed.createComponent(KeepLabelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
