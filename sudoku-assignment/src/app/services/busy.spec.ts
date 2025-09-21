import { TestBed } from '@angular/core/testing';

import { Busy } from './busy';

describe('Busy', () => {
  let service: Busy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Busy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
