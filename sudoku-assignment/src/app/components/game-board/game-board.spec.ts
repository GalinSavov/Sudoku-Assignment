import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoard } from './game-board';
import { SudokuState } from '../../services/sudoku-state';
import { SudokuGame } from '../../services/sudoku-game';
import { Busy } from '../../services/busy';
import { MatSelectionListChange } from '@angular/material/list';

// ---- helper to mock Angular signals ----
function createSignalMock<T>(initialValue: T): any {
  let value = initialValue;
  const fn = jest.fn(() => value) as any;
  fn.set = jest.fn((newValue: T) => { value = newValue; });
  fn.update = jest.fn((updater: (v: T) => T) => { value = updater(value); });
  return fn;
}

describe('GameBoard Component (Jest)', () => {
  let fixture: ComponentFixture<GameBoard>;
  let component: GameBoard;
  let state: jest.Mocked<SudokuState>;
  let game: jest.Mocked<SudokuGame>;

  beforeEach(async () => {
    const stateMock: Partial<jest.Mocked<SudokuState>> = {
      generateBoard: jest.fn(),
      validateBoard: jest.fn(),
      solveBoard: jest.fn(),
      isCellValid: jest.fn(),
      gameBoard: createSignalMock(null), 
      apiBoard: createSignalMock(null),
      difficulty: createSignalMock<'easy'>('easy'),
      mistakes: createSignalMock<number>(3),
    };

    const gameMock: Partial<jest.Mocked<SudokuGame>> = {
      isBoardComplete: jest.fn(),
      convertGameBoardToApiBoard: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GameBoard],
      providers: [
        { provide: SudokuState, useValue: stateMock },
        { provide: SudokuGame, useValue: gameMock },
        { provide: Busy, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoard);
    component = fixture.componentInstance;
    state = TestBed.inject(SudokuState) as jest.Mocked<SudokuState>;
    game = TestBed.inject(SudokuGame) as jest.Mocked<SudokuGame>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls generateBoard on init when no board exists', () => {
    (state.gameBoard as any).mockReturnValue(null);

    component.ngOnInit();

    expect(state.generateBoard).toHaveBeenCalledWith('easy');
  });

  it('does not call generateBoard on init when a board exists', () => {
    (state.gameBoard as any).mockReturnValue([[{ value: 1 } as any]]);

    component.ngOnInit();

    expect(state.generateBoard).not.toHaveBeenCalled();
  });

  it('updates difficulty and regenerates board on difficulty change', () => {
    const mockEvent = {
      options: [{ value: 'hard' }],
    } as unknown as MatSelectionListChange;

    component.onDifficultyChange(mockEvent);

    expect(state.difficulty.set).toHaveBeenCalledWith('hard');
    expect(state.generateBoard).toHaveBeenCalledWith('hard');
    expect(component['selectedDifficulty']).toBe('hard');
  });

  it('moves selected cell with ArrowUp key', () => {
    component['selectedCell'] = { row: 5, column: 5 };

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    jest.spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(component['selectedCell']).toEqual({ row: 4, column: 5 });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('validates input when pressing number keys', () => {
    component['selectedCell'] = { row: 0, column: 0 };
    const event = new KeyboardEvent('keydown', { key: '5' });
    jest.spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(state.isCellValid).toHaveBeenCalledWith(0, 0, 5);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('rejects invalid keys', () => {
    component['selectedCell'] = { row: 0, column: 0 };
    const event = new KeyboardEvent('keydown', { key: 'x' });
    jest.spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(state.isCellValid).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('returns true for highlight if in same row', () => {
    component['selectedCell'] = { row: 1, column: 1 };
    const cell = { row: 1, column: 3 } as any;

    expect(component.isCellInHighlight(cell)).toBe(true);
  });

  it('returns true for highlight if in same mini-square', () => {
    component['selectedCell'] = { row: 1, column: 1 };
    const cell = { row: 2, column: 2 } as any;

    expect(component.isCellInHighlight(cell)).toBe(true);
  });

  it('returns false for highlight if unrelated cell', () => {
    component['selectedCell'] = { row: 1, column: 1 };
    const cell = { row: 5, column: 5 } as any;

    expect(component.isCellInHighlight(cell)).toBe(false);
  });
});
