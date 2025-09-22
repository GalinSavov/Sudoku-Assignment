import { TestBed } from '@angular/core/testing';
import { SudokuGame } from './sudoku-game';
import { GameBoard } from '../models/gameBoard';
import { Board } from '../models/board';
import { ValidCellInput } from '../models/validCellInput';

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('SudokuGame', () => {
  let service: SudokuGame;
  let emptyApiBoard: Board;
  let emptyGameBoard: GameBoard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuGame);

    emptyApiBoard = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 0)
    );

    emptyGameBoard = service.convertApiBoardToGameBoard(emptyApiBoard);
  });

  describe('convertApiBoardToGameBoard', () => {
    it('should convert an api board to a game board with active cells', () => {
      const apiBoard: Board = [
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        ...Array.from({ length: 8 }, () => Array(9).fill(0)),
      ];

      const gameBoard = service.convertApiBoardToGameBoard(apiBoard);

      expect(gameBoard[0][0].value).toBe(5);
      expect(gameBoard[0][0].active).toBeFalsy();
      expect(gameBoard[0][1].value).toBe(0);
      expect(gameBoard[0][1].active).toBeTruthy();
    });
  });

  describe('convertGameBoardToApiBoard', () => {
    it('should convert a game board to an api board', () => {
      const apiBoard = service.convertGameBoardToApiBoard(emptyGameBoard);
      expect(apiBoard).toEqual(emptyApiBoard);
    });
  });

  describe('isBoardComplete', () => {
    it('should return false for empty board', () => {
      expect(service.isBoardComplete(emptyGameBoard)).toBeFalsy();
    });

    it('should return true for completed board without invalid cells', () => {
      const completedBoard: GameBoard = Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => ({
          value: (c + r) % 9 + 1,
          active: false,
          row: r,
          column: c,
          invalid: false,
        }))
      );
      expect(service.isBoardComplete(completedBoard)).toBeTruthy();
    });
  });

  describe('isCellValid', () => {
    it('should mark cell valid if no duplicates', () => {
      const gameBoard = clone(emptyGameBoard);
      const apiBoard = clone(emptyApiBoard);

      const input: ValidCellInput = {
        gameBoard,
        apiBoard,
        cellRow: 0,
        cellCol: 0,
        newValue: 1,
        mistakes: 3,
      };

      const result = service.isCellValid(input);
      expect(result.isValid).toBeTruthy();
      expect(result.mistakes).toBe(3);
      expect(result.gameBoard[0][0].invalid).toBeFalsy();
    });

    it('should mark cell invalid if duplicate in row', () => {
      const gameBoard = clone(emptyGameBoard);
      gameBoard[0][1].value = 5;
      const apiBoard = clone(emptyApiBoard);
      apiBoard[0][1] = 5;

      const input: ValidCellInput = {
        gameBoard,
        apiBoard,
        cellRow: 0,
        cellCol: 0,
        newValue: 5,
        mistakes: 3,
      };

      const result = service.isCellValid(input);
      expect(result.isValid).toBeFalsy();
      expect(result.mistakes).toBe(2);
      expect(result.gameBoard[0][0].invalid).toBeTruthy();
    });

    it('should mark cell invalid if duplicate in column', () => {
      const gameBoard = clone(emptyGameBoard);
      gameBoard[5][0].value = 7;
      const apiBoard = clone(emptyApiBoard);
      apiBoard[5][0] = 7;

      const input: ValidCellInput = {
        gameBoard,
        apiBoard,
        cellRow: 0,
        cellCol: 0,
        newValue: 7,
        mistakes: 3,
      };

      const result = service.isCellValid(input);
      expect(result.isValid).toBeFalsy();
      expect(result.mistakes).toBe(2);
      expect(result.gameBoard[0][0].invalid).toBeTruthy();
    });

    it('should mark cell invalid if duplicate in mini-square', () => {
      const gameBoard = clone(emptyGameBoard);
      gameBoard[1][1].value = 9; 
      const apiBoard = clone(emptyApiBoard);
      apiBoard[1][1] = 9;

      const input: ValidCellInput = {
        gameBoard,
        apiBoard,
        cellRow: 0,
        cellCol: 0,
        newValue: 9,
        mistakes: 3,
      };

      const result = service.isCellValid(input);
      expect(result.isValid).toBeFalsy();
      expect(result.mistakes).toBe(2);
      expect(result.gameBoard[0][0].invalid).toBeTruthy();
    });

    it('should not let mistakes go below 0', () => {
      const gameBoard = clone(emptyGameBoard);
      gameBoard[0][1].value = 4;
      const apiBoard = clone(emptyApiBoard);
      apiBoard[0][1] = 4;

      const input: ValidCellInput = {
        gameBoard,
        apiBoard,
        cellRow: 0,
        cellCol: 0,
        newValue: 4,
        mistakes: 0,
      };

      const result = service.isCellValid(input);
      expect(result.isValid).toBeFalsy();
      expect(result.mistakes).toBe(0);
    });
  });
});
