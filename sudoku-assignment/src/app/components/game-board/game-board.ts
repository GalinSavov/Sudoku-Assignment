import { Component, inject, OnInit } from '@angular/core';
import { SudokuState } from '../../services/sudoku-state';
import { Difficulty } from '../../models/difficulty';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgClass } from '@angular/common';
import { BoardCell } from '../../models/boardCell';
import { GameOver } from "../game-over/game-over";
import { SudokuGame } from '../../services/sudoku-game';
import { GameWon } from "../game-won/game-won";
import { Busy } from '../../services/busy';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { GameControls } from '../game-controls/game-controls';
import { CelectedCell } from '../../models/selectedCell';
@Component({
  selector: 'app-game-board',
  imports: [ FormsModule, ReactiveFormsModule, 
    NgClass, GameOver, GameWon,MatProgressSpinner,GameControls],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard{

  protected sudokuStateService = inject(SudokuState);
  protected sudokuGameService = inject(SudokuGame);
  protected busyService = inject(Busy);
  protected readonly sudokuSize: number = 9;
  protected selectedCell: CelectedCell = {row:-1,column:-1};

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
