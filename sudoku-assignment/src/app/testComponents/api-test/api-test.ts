import { Component, inject, OnInit, signal } from '@angular/core';
import { Difficulty } from '../../models/difficulty';
import { MatButton } from '@angular/material/button';
import { SudokuState } from '../../services/sudoku-state';

@Component({
  selector: 'app-api-test',
  imports: [MatButton],
  templateUrl: './api-test.html',
  styleUrl: './api-test.scss'
})
export class ApiTest {
  /*
  protected sudokuStateService = inject(SudokuState);
  generateBoard(difficulty:Difficulty){
    if(this.sudokuStateService.apiBoard()) return;
    this.sudokuStateService.generateBoard(difficulty);
  }
  validateBoard(){
    if(!this.sudokuStateService.apiBoard()) return;
    this.sudokuStateService.validateBoard(this.sudokuStateService.apiBoard()!);
  }
  solveBoard(){
    if(!this.sudokuStateService.apiBoard()) return;
    this.sudokuStateService.solveBoard(this.sudokuStateService.apiBoard()!)
  }
    */
}
