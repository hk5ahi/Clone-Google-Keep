import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepCommonEditorComponent } from './keep-common-editor.component';

describe('KeepCommonEditorComponent', () => {
  let component: KeepCommonEditorComponent;
  let fixture: ComponentFixture<KeepCommonEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepCommonEditorComponent]
    });
    fixture = TestBed.createComponent(KeepCommonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
