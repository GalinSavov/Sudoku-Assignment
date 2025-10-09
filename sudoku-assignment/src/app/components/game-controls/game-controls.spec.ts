import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SudokuState } from '../../services/sudoku-state';
import { SudokuGame } from '../../services/sudoku-game';
import { MatSelectionListChange } from '@angular/material/list';
import { GameControls } from './game-controls';

function createSignalMock<T>(initialValue: T): any {
  let value = initialValue;
  const fn = jest.fn(() => value) as any;
  fn.set = jest.fn((newValue: T) => {
    value = newValue;
  });
  fn.update = jest.fn((updater: (v: T) => T) => {
    value = updater(value);
  });
  return fn;
}

describe('GameBoard Component (Jest)', () => {
  let fixture: ComponentFixture<GameControls>;
  let component: GameControls;
  let state: jest.Mocked<SudokuState>;
  let game: jest.Mocked<SudokuGame>;
  beforeEach(async () => {
    const stateMock: Partial<jest.Mocked<SudokuState>> = {
      isCellValid: jest.fn(),
      generateBoard: jest.fn(),
      gameBoard: createSignalMock(null),
      apiBoard: createSignalMock(null),
      difficulty: createSignalMock<'easy'>('easy'),
      mistakes: createSignalMock<number>(3),
    };
    await TestBed.configureTestingModule({
      imports: [GameControls],
      providers: [{ provide: SudokuState, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameControls);
    component = fixture.componentInstance;
    state = TestBed.inject(SudokuState) as jest.Mocked<SudokuState>;
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
});
