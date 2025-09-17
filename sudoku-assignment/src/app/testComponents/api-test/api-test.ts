import { Component, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../services/api';
import { ApiParams } from '../../models/apiParams';
import { Difficulty } from '../../models/difficulty';
import { Board } from '../../models/board';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-api-test',
  imports: [MatButton],
  templateUrl: './api-test.html',
  styleUrl: './api-test.scss'
})
export class ApiTest implements OnInit {

  board = signal<Board | null>(null);
  status = signal<string | null>(null);
   
  protected apiService = inject(Api);
  ngOnInit(): void {
    this.generateBoard('easy');
  }
  generateBoard(difficulty:Difficulty){
    if(this.board()) return;
    let apiParams: ApiParams ={difficulty};
    this.apiService.generateData(apiParams)?.subscribe({
      next: response => this.board.set(response.board),
      error: error => console.log(error)
    });;
  }
  validateBoard(){
    if(!this.board()) return;
    this.apiService.validateBoard(this.board()!).subscribe({
      next: response => this.status.set(response.status)
    })
  }
  solveBoard(){
    if(!this.board()) return;
    this.apiService.solveBoard(this.board()!).subscribe({
      next: response => this.board.set(response.solution)
    })
  }

}
