import { inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Difficulty } from '../models/difficulty';
import { Board } from '../models/board';
import { Snackbar } from './snackbar';
import { GameBoard } from '../models/gameBoard';
import { SudokuGame } from './sudoku-game';
import { ValidCellInput } from '../models/validCellInput';
import { showSudokuStatus } from './helpers/sudoku-ui-message-';
import { getMistakesPerDifficulty } from './helpers/game-utils';
@Injectable({
  providedIn: 'root',
})
export class SudokuState {
  private apiService = inject(Api);
  private snackbarService = inject(Snackbar);
  private sudokuGameService = inject(SudokuGame);
  apiBoard = signal<Board | null>(null);
  status = signal<string | null>(null);
  difficulty = signal<Difficulty | null>(null);
  gameBoard = signal<GameBoard | null>(null);
  mistakes = signal<number | null>(null);
  autoSolved = signal<boolean>(false);

  generateBoard(difficulty: Difficulty) {
    this.resetSignals();
    return this.apiService.generateData(difficulty).subscribe({
      next: (response) => {
        this.apiBoard.set(response.board);
        this.difficulty.set(difficulty);
        this.mistakes.set(getMistakesPerDifficulty(difficulty));
        this.gameBoard.set(this.sudokuGameService.convertApiBoardToGameBoard(this.apiBoard()!));
      },
      error: (error) => console.log(error),
    });
  }

  validateBoard() {
    this.apiBoard.set(this.sudokuGameService.convertGameBoardToApiBoard(this.gameBoard()!));
    return this.apiService.validateBoard(this.apiBoard()!).subscribe({
      next: (response) => {
        this.status.set(response.status);
        showSudokuStatus(this.snackbarService, response.status);
      },
      error: (error) => console.log(error),
    });
  }
  solveBoard(gameBoard: GameBoard) {
    this.apiBoard.set(this.sudokuGameService.convertGameBoardToApiBoard(gameBoard));
    return this.apiService.solveBoard(this.apiBoard()!).subscribe({
      next: (response) => {
        if (response.status === 'unsolvable') {
          this.status.set('broken');
          showSudokuStatus(this.snackbarService, this.status()!);
          return;
        } else {
          this.status.set('solved');
          this.autoSolved.set(true);
        }
        showSudokuStatus(this.snackbarService, this.status()!);
        this.apiBoard.set(response.solution);
        this.gameBoard.set(this.sudokuGameService.convertApiBoardToGameBoard(this.apiBoard()!));
      },
      error: (error) => console.log(error),
    });
  }
  isCellValid(cellRow: number, cellCol: number, newValue: number): boolean {
    const input: ValidCellInput = {
      gameBoard: this.gameBoard()!,
      apiBoard: this.apiBoard()!,
      cellRow: cellRow,
      cellCol: cellCol,
      newValue: newValue,
      mistakes: this.mistakes()!,
    };
    const isValid = this.sudokuGameService.isCellValid(input);
    this.gameBoard.set(isValid.gameBoard);
    this.apiBoard.set(isValid.apiBoard);
    this.mistakes.set(isValid.mistakes);
    return isValid.isValid;
  }
  resetSignals(){
      this.status.set(null);
      this.apiBoard.set(null);
      this.gameBoard.set(null);
      this.mistakes.set(null);
      this.autoSolved.set(false);
  }
}
