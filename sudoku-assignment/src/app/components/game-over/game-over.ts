import { Component, inject } from '@angular/core';
import { SudokuState } from '../../services/sudoku-state';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-game-over',
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardActions, MatButton],
  templateUrl: './game-over.html',
  styleUrl: './game-over.scss'
})
export class GameOver {
  protected sudokuStateService = inject(SudokuState);
  restartGame(){
    const difficulty = this.sudokuStateService.difficulty() ?? 'easy';
    this.sudokuStateService.generateBoard(difficulty);
  }
}
