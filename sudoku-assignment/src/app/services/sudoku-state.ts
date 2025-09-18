import { inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Difficulty } from '../models/difficulty';
import { Board } from '../models/board';
import { Snackbar } from './snackbar';
@Injectable({
  providedIn: 'root'
})
export class SudokuState {
  private apiService = inject(Api);
  private snackbarService = inject(Snackbar);
  board = signal<Board | null>(null);
  status = signal<string | null>(null);
  difficulty = signal<Difficulty | null>(null);

  generateBoard(difficulty:Difficulty)
  {
    return this.apiService.generateData(difficulty).subscribe({
      next: response =>{
        this.board.set(response.board),
        this.difficulty.set(difficulty)
      },
      error: error => console.log(error)
    });
  }
  validateBoard(board:Board){
    return this.apiService.validateBoard(board).subscribe({
      next: response =>{
        this.status.set(response.status);
        this.status() === 'unsolved' ? this.snackbarService.unsolved('Not Correct!') : this.snackbarService.solved('Correct!');
      } ,
      error: error => console.log(error)
    });
  }
  solveBoard(board:Board){
    return this.apiService.solveBoard(board).subscribe({
      next: response => this.board.set(response.solution),
      error: error => console.log(error)
    });
  }
}
