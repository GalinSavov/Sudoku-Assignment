import { Snackbar } from "../snackbar";

export function showSudokuStatus(snackbar:Snackbar,status:string){
    switch(status){
    case 'unsolved':
      snackbar.error('Sudoku is unsolved!');
      break;
    case 'broken':
      snackbar.error('Sudoku cannot be solved in this state!');
      break;
    case 'solved':
      snackbar.success('Sudoku is solved!');
      break;
  }
}