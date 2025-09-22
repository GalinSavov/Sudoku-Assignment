import { TestBed } from '@angular/core/testing';
import { SudokuState } from './sudoku-state';
import { Api } from './api';
import { SudokuGame } from './sudoku-game';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Difficulty } from '../models/difficulty';
import { Board } from '../models/board';
import { GameBoard } from '../models/gameBoard';

describe('SudokuState', () => {
  let service: SudokuState;
  let api: jest.Mocked<Api>;
  let gameService: jest.Mocked<SudokuGame>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SudokuState,
        {
          provide: Api,
          useValue: { generateData: jest.fn(), validateBoard: jest.fn(), solveBoard: jest.fn() },
        },
        {
          provide: SudokuGame,
          useValue: {
            convertApiBoardToGameBoard: jest.fn(),
            convertGameBoardToApiBoard: jest.fn(),
            isCellValid: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(SudokuState);
    api = TestBed.inject(Api) as jest.Mocked<Api>;
    gameService = TestBed.inject(SudokuGame) as jest.Mocked<SudokuGame>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a board', () => {
    const mockBoard: Board = Array(9).fill(Array(9).fill(0));
    const difficulty: Difficulty = 'easy';
    api.generateData.mockReturnValue(of({ board: mockBoard }));

    const gameBoard: GameBoard = Array(9).fill(
      Array(9).fill({ value: 0, active: true, invalid: false, row: 0, column: 0 })
    );
    gameService.convertApiBoardToGameBoard.mockReturnValue(gameBoard);

    service.generateBoard(difficulty);

    expect(api.generateData).toHaveBeenCalledWith(difficulty);
    expect(service.apiBoard()).toEqual(mockBoard);
    expect(service.gameBoard()).toEqual(gameBoard);
    expect(service.difficulty()).toBe(difficulty);
  });

  it('should validate board and update status', () => {
    const board: Board = Array(9).fill(Array(9).fill(0));
    const gameBoard: GameBoard = [];
    service.apiBoard.set(board);
    service.gameBoard.set(gameBoard);

    api.validateBoard.mockReturnValue(of({ status: 'unsolved' }));
    gameService.convertGameBoardToApiBoard.mockReturnValue(board);
    service.validateBoard();
    expect(api.validateBoard).toHaveBeenCalledWith(board);
    expect(service.status()).toBe('unsolved');
  });

  it('should solve board successfully', () => {
    const board: Board = Array(9).fill(Array(9).fill(0));
    const gameBoard: GameBoard = [];
    const difficulty: Difficulty = 'easy';
    service.apiBoard.set(board);
    service.gameBoard.set(gameBoard);

    api.solveBoard.mockReturnValue(of({ difficulty, solution: board, status: 'solved' }));
    gameService.convertGameBoardToApiBoard.mockReturnValue(board);
    gameService.convertApiBoardToGameBoard.mockReturnValue(gameBoard);

    service.solveBoard(gameBoard);

    expect(api.solveBoard).toHaveBeenCalledWith(board);
    expect(service.status()).toBe('solved');
  });
});
