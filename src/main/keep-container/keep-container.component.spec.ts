import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepContainerComponent } from './keep-container.component';
import {KeepSideBarComponent} from "../side-bar/keep-side-bar.component";

describe('KeepNotesContainerComponent', () => {
  let component: KeepContainerComponent;
  let fixture: ComponentFixture<KeepContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepContainerComponent]
    });
    fixture = TestBed.createComponent(KeepSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
