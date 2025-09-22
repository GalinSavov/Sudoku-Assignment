import { Component} from '@angular/core';
@Component({
  selector: 'app-api-test',
  imports: [],
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
