import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepStoreLabelsComponent } from './keep-store-labels.component';

describe('KeepStoreLabelsComponent', () => {
  let component: KeepStoreLabelsComponent;
  let fixture: ComponentFixture<KeepStoreLabelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepStoreLabelsComponent]
    });
    fixture = TestBed.createComponent(KeepStoreLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
