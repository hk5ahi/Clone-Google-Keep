import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepCommonNoteComponent } from './keep-common-note.component';

describe('KeepCommonNoteComponent', () => {
  let component: KeepCommonNoteComponent;
  let fixture: ComponentFixture<KeepCommonNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepCommonNoteComponent]
    });
    fixture = TestBed.createComponent(KeepCommonNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
