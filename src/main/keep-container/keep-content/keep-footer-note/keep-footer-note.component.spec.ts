import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepFooterNoteComponent } from './keep-footer-note.component';

describe('KeepFooterNoteComponent', () => {
  let component: KeepFooterNoteComponent;
  let fixture: ComponentFixture<KeepFooterNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepFooterNoteComponent]
    });
    fixture = TestBed.createComponent(KeepFooterNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
