import { inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Difficulty } from '../models/difficulty';
import { Board } from '../models/board';
import { Snackbar } from './snackbar';
import { GameBoard } from '../models/gameBoard';
@Injectable({
  providedIn: 'root'
})
export class SudokuState {
  private apiService = inject(Api);
  private snackbarService = inject(Snackbar);
  apiBoard = signal<Board | null>(null);
  status = signal<string | null>(null);
  difficulty = signal<Difficulty | null>(null);
  gameBoard = signal<GameBoard | null>(null);
  mistakes = signal<number | null> (null);

  generateBoard(difficulty:Difficulty)
  {
    return this.apiService.generateData(difficulty).subscribe({
      next: response =>{
        this.apiBoard.set(response.board);
        this.difficulty.set(difficulty);
        this.setupMistakesPerGame(difficulty);
        this.gameBoard.set(this.convertApiBoardToGameBoard(this.apiBoard()!));
      },
      error: error => console.log(error)
    });
  }
  setupMistakesPerGame(difficulty:Difficulty){
    switch (difficulty) {
          case 'easy':
            this.mistakes.set(4);
            break;
          case 'medium':
            this.mistakes.set(3);
            break;  
          case 'hard':
            this.mistakes.set(2);
            break;        
          default:
            break;
        }
  }
  showSnackbarStatusMessage(status:string){
    switch (status) {
      case 'unsolved':
        this.snackbarService.error('Sudoku is unsolved!');
        break;
      case 'broken':
        this.snackbarService.error('Sudoku can not be solved in this state!');
        break;
        case 'solved':
        this.snackbarService.success('Sudoku is solved!');
        break;
      default:
        break;
    }
  }
  validateBoard(){
    this.apiBoard.set(this.convertGameBoardToApiBoard(this.gameBoard()!));
    return this.apiService.validateBoard(this.apiBoard()!).subscribe({
      next: response =>{
        this.status.set(response.status);
        this.showSnackbarStatusMessage(response.status);
      } ,
      error: error => console.log(error)
    });
  }
  solveBoard(gameBoard:GameBoard){
    this.apiBoard.set(this.convertGameBoardToApiBoard(gameBoard));
    if(this.status() === 'solved') return;
    return this.apiService.solveBoard(this.apiBoard()!).subscribe({
      next: response =>{
        if(response.status === 'unsolvable'){
          this.status.set('broken');
          this.showSnackbarStatusMessage(this.status()!);
          return;
        }
        else{
          this.status.set('solved');
        }
        this.showSnackbarStatusMessage(this.status()!);
        this.apiBoard.set(response.solution);
        this.gameBoard.set(this.convertApiBoardToGameBoard(this.apiBoard()!));
      },
      error: error => console.log(error)
    });
  }
  updateBoard(cellRow:number,cellCol:number,newValue:number):boolean{
    const cell = this.gameBoard()![cellRow][cellCol];
    if(cell.active){
      cell.value = newValue;
    }
    const boxRow = Math.floor(cellRow / 3);
    const boxCol = Math.floor(cellCol / 3);
    //Check the row
    if (this.gameBoard()![cellRow].some(c => c.value === newValue && c.column !== cellCol)){
      cell.invalid = true;
      this.mistakes.set(Math.max(0,this.mistakes()! - 1))
      return false;
    } 

    //Check columns
    if (this.gameBoard()!.some(row => row.at(cellCol)?.value === newValue && row !== this.gameBoard()![cellRow])){
      cell.invalid = true;
      this.mistakes.set(Math.max(0,this.mistakes()! - 1))
      return false;
    } 
    
    // Mini-square
    const startRow = boxRow * 3;
    const startCol = boxCol * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === cellRow && c === cellCol) continue;
        if (this.gameBoard()![r][c].value === newValue){
          cell.invalid = true;
          this.mistakes.set(Math.max(0,this.mistakes()! - 1))
          return false;
        }
      }
    }
    
    this.apiBoard.set(this.convertGameBoardToApiBoard(this.gameBoard()!));
    cell.invalid = false;
    return true; 
  }
  convertApiBoardToGameBoard(board:Board):GameBoard{
    const gameBoard:GameBoard = board.map((row,rowIndex)=> row.map((cell,colIndex) => ({
      value: cell,
      active: cell === 0,
      row: rowIndex,
      column:colIndex,
      invalid: false
    })))
    return gameBoard;
  }
  convertGameBoardToApiBoard(gameBoard:GameBoard):Board{
    const apiBoard:Board = gameBoard.map(row=>row.map(cell =>cell.value))
    return apiBoard;
  }
}
