import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepContentComponent } from './keep-content.component';

describe('KeepContentComponent', () => {
  let component: KeepContentComponent;
  let fixture: ComponentFixture<KeepContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepContentComponent]
    });
    fixture = TestBed.createComponent(KeepContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
