import { Component, inject, OnInit } from '@angular/core';
import { SudokuState } from '../../services/sudoku-state';
import { Difficulty } from '../../models/difficulty';
import { MatButton } from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { NgClass } from '@angular/common';
import { BoardCell } from '../../models/boardCell';
import { GameOver } from "../game-over/game-over";
import { SudokuGame } from '../../services/sudoku-game';
import { GameWon } from "../game-won/game-won";
import { Busy } from '../../services/busy';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-game-board',
  imports: [MatButton, FormsModule, ReactiveFormsModule, MatMenu, 
    MatMenuTrigger, MatIcon, MatListOption, MatSelectionList, 
    NgClass, GameOver, GameWon,MatProgressSpinner],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard implements OnInit {

  protected sudokuStateService = inject(SudokuState);
  protected sudokuGameService = inject(SudokuGame);
  protected busyService = inject(Busy);
  protected readonly sudokuSize: number = 9;
  protected numPad: number[] = [1,2,3,4,5,6,7,8,9];
  protected readonly difficulties: Difficulty[] = ['easy','medium','hard'];
  protected selectedDifficulty:Difficulty = 'easy';
  protected selectedCell: {row:number,column:number} | null = null;

  ngOnInit(): void {
    if(!this.sudokuStateService.gameBoard())
    this.generateBoard('easy');
  }
  generateBoard(difficulty:Difficulty){
      this.sudokuStateService.generateBoard(difficulty);
    }
  validateBoard(){
    if(!this.sudokuStateService.gameBoard()) return;
    this.sudokuStateService.validateBoard();
  }
  solveBoard(){
    if(!this.sudokuStateService.gameBoard()) return;
    this.sudokuStateService.solveBoard(this.sudokuStateService.gameBoard()!);
  }
  onDifficultyChange(event:MatSelectionListChange)
  {
      const selectedDifficulty = event.options[0];
      if(selectedDifficulty){
        this.sudokuStateService.difficulty.set(selectedDifficulty.value);
        this.selectedDifficulty = this.sudokuStateService.difficulty()!;
        this.generateBoard(this.selectedDifficulty);
      }
  }
  onKeyDown(event:KeyboardEvent){
    if(!this.selectedCell) return;
    const boundsIndex = 8;
    let {row,column} = this.selectedCell;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        row = Math.max(0,row - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        row = Math.min(boundsIndex,row + 1);  
        break;
      case 'ArrowRight':
        event.preventDefault();
        column = Math.min(boundsIndex,column + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        column = Math.max(0,column - 1);
        break;    
      default:
        // Only allow numbers 1-9, Backspace, Delete
        if (!/^[1-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
        event.preventDefault();
      } else if (/^[1-9]$/.test(event.key)) {
        // Insert number into the selected cell directly
        this.sudokuStateService.isCellValid(row, column, parseInt(event.key, 10));
        event.preventDefault();
      }
        break;
    }
    this.selectedCell = {row,column};
    this.focusCell(row,column);
  }
  onCellInput(event:any,cellRow:number,cellCol:number,boardCell:BoardCell){
    const input = event.target as HTMLInputElement;

    if (input.value.length > 1) input.value = input.value[0];

    const value = parseInt(input.value, 10);
    if (isNaN(value)) {
    boardCell.value = 0;     
    boardCell.invalid = false; 
    this.sudokuStateService.apiBoard.set(
      this.sudokuGameService.convertGameBoardToApiBoard(this.sudokuStateService.gameBoard()!)
    );
    return;
    }
    if (value < 1 || value > 9) {
      input.value = '';
      return;
    }

    if (boardCell.invalid) boardCell.invalid = false;

    const isCellValid = this.sudokuStateService.isCellValid(cellRow, cellCol, value);

    if (!isCellValid) {
      boardCell.invalid = true;
      this.sudokuStateService.mistakes()! > 0 &&
        this.sudokuStateService.mistakes.set(this.sudokuStateService.mistakes()! - 1);
      if (this.sudokuStateService.mistakes() === 0) console.warn('Game Over!');
      } else {
      this.sudokuStateService.isCellValid(cellRow, cellCol, value);

      if (this.sudokuGameService.isBoardComplete(this.sudokuStateService.gameBoard()!)) {
        console.log('YOU WON');
      }
    }
  }
  private focusCell(row: number, col: number) {
  setTimeout(() => {
    const el = document.querySelector(
      `[data-cell="${row}-${col}"]`
    ) as HTMLInputElement | null;
    if (el) {
      el.focus();
    }
  });
}
  onNumpadClick(newValue:number){
    if(!this.selectedCell) return;
    const {row,column} = this.selectedCell;
    const valid = this.sudokuStateService.isCellValid(row,column,newValue);
    if(valid) this.selectedCell = null;
  }
  isCellInHighlight(cell: BoardCell): boolean {
  if (!this.selectedCell) return false;

  const { row, column } = this.selectedCell;

  // same row or same column
  if (cell.row === row || cell.column === column) return true;

  // same mini-square
  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(column / 3);
  const cellBoxRow = Math.floor(cell.row / 3);
  const cellBoxCol = Math.floor(cell.column / 3);

  return boxRow === cellBoxRow && boxCol === cellBoxCol;
  }
}
