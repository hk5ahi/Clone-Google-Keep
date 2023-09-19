import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepAddNotesComponent } from './keep-add-notes.component';

describe('KeepAddNotesComponent', () => {
  let component: KeepAddNotesComponent;
  let fixture: ComponentFixture<KeepAddNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepAddNotesComponent]
    });
    fixture = TestBed.createComponent(KeepAddNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
