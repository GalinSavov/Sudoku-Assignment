import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Difficulty } from '../../models/difficulty';
import { SudokuState } from '../../services/sudoku-state';
import { CelectedCell } from '../../models/selectedCell';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game-controls',
  imports: [MatIcon, MatMenuTrigger, MatMenu, MatListOption, MatSelectionList,MatButton],
  templateUrl: './game-controls.html',
  styleUrl: './game-controls.scss',
})
export class GameControls implements OnInit {
  protected readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  protected selectedDifficulty: Difficulty = 'easy';
  protected numPad: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected sudokuStateService = inject(SudokuState);
  @Input () selectedCell: CelectedCell = {row:-1,column:-1};

  ngOnInit(): void {
    if (!this.sudokuStateService.gameBoard()) this.generateBoard(this.selectedDifficulty);
  }
  generateBoard(difficulty: Difficulty) {
    this.sudokuStateService.generateBoard(difficulty);
  }
  validateBoard() {
    if (!this.sudokuStateService.gameBoard()) return;
    this.sudokuStateService.validateBoard();
  }
  solveBoard() {
    if (!this.sudokuStateService.gameBoard()) return;
    this.sudokuStateService.solveBoard(this.sudokuStateService.gameBoard()!);
  }
  onDifficultyChange(event: MatSelectionListChange) {
    const selectedDifficulty = event.options[0];
    if (selectedDifficulty) {
      this.sudokuStateService.difficulty.set(selectedDifficulty.value);
      this.selectedDifficulty = this.sudokuStateService.difficulty()!;
      this.generateBoard(this.selectedDifficulty);
    }
  }
  onNumpadClick(newValue: number) {
    if (!this.selectedCell) return;
    const { row, column } = this.selectedCell;
    const valid = this.sudokuStateService.isCellValid(row, column, newValue);
    if (valid) this.selectedCell = {row: -1, column: -1};
  }
}
