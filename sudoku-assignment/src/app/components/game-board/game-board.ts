import { Component, inject, OnInit } from '@angular/core';
import { SudokuState } from '../../services/sudoku-state';
import { Difficulty } from '../../models/difficulty';
import { MatButton } from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
@Component({
  selector: 'app-game-board',
  imports: [MatButton,FormsModule, ReactiveFormsModule,MatMenu,MatMenuTrigger,MatIcon,MatListOption, MatSelectionList ],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard implements OnInit {

  protected sudokuStateService = inject(SudokuState);
  protected sudokuSize: number = 9;
  protected numPad: number[] = [1,2,3,4,5,6,7,8,9];
  protected difficulties: Difficulty[] = ['easy','medium','hard'];
  protected selectedDifficulty:Difficulty = 'easy';

  ngOnInit(): void {
    this.generateBoard('easy');
  }
  generateBoard(difficulty:Difficulty){
      this.sudokuStateService.generateBoard(difficulty);
    }
  validateBoard(){
    if(!this.sudokuStateService.board()) return;
    this.sudokuStateService.validateBoard(this.sudokuStateService.board()!);
  }
  solveBoard(){
    if(!this.sudokuStateService.board()) return;
    this.sudokuStateService.solveBoard(this.sudokuStateService.board()!)
  }
  onDifficultyChange(event:MatSelectionListChange)
  {
      const selectedDifficulty = event.options[0];
      if(selectedDifficulty){
        this.sudokuStateService.difficulty.set(selectedDifficulty.value);
        this.selectedDifficulty = this.sudokuStateService.difficulty()!;
      }
  }
}
