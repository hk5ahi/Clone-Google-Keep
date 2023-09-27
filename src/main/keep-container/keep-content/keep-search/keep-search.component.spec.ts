import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeepSearchComponent } from "./keep-search.component";


describe('SearchComponent', () => {
  let component: KeepSearchComponent;
  let fixture: ComponentFixture<KeepSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepSearchComponent]
    });
    fixture = TestBed.createComponent(KeepSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
