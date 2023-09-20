import { TestBed } from '@angular/core/testing';

import { KeepService } from './keep.service';

describe('KeepService', () => {
  let service: KeepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
