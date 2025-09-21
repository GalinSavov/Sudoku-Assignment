import { TestBed } from '@angular/core/testing';

import { SudokuGame } from './sudoku-game';

describe('SudokuGame', () => {
  let service: SudokuGame;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuGame);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
