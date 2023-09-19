import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KeepNotesArchiveComponent} from './keep-notes-archive.component';

describe('KeepNotesArchiveComponent', () => {
  let component: KeepNotesArchiveComponent;
  let fixture: ComponentFixture<KeepNotesArchiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepNotesArchiveComponent]
    });
    fixture = TestBed.createComponent(KeepNotesArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
