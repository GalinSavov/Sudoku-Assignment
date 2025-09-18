import { TestBed } from '@angular/core/testing';

import { SudokuState } from './sudoku-state';

describe('SudokuState', () => {
  let service: SudokuState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
