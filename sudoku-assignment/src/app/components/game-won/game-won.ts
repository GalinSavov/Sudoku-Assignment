import { Component, inject } from '@angular/core';
import { SudokuGame } from '../../services/sudoku-game';
import { SudokuState } from '../../services/sudoku-state';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game-won',
  imports: [MatButton],
  templateUrl: './game-won.html',
  styleUrl: './game-won.scss'
})
export class GameWon {
  protected sudokuGameService = inject(SudokuGame);
  protected sudokuStateService = inject(SudokuState);
  boardBeforeAutoSolve = this.sudokuStateService.preAutoSolveBoard;
  boardNow = this.sudokuStateService.gameBoard();
  restartGame(){
    const difficulty = this.sudokuStateService.difficulty() ?? 'easy';
    this.sudokuStateService.generateBoard(difficulty);
  }
}
