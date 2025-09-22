import { Injectable } from '@angular/core';
import { GameBoard } from '../models/gameBoard';
import { Board } from '../models/board';
import { ValidCellInput } from '../models/validCellInput';
import { ValidCellOutput } from '../models/validCellOutput';

@Injectable({
  providedIn: 'root',
})
export class SudokuGame {
  isCellValid(input: ValidCellInput): ValidCellOutput {
    const gameBoard = input.gameBoard.map((row) => row.map((cell) => ({ ...cell })));
    const cell = gameBoard[input.cellRow][input.cellCol];
    let isValid = true;
    if (cell.active) {
      cell.value = input.newValue;
    }
    const boxRow = Math.floor(input.cellRow / 3);
    const boxCol = Math.floor(input.cellCol / 3);
    //Check the row
    if (
      gameBoard[input.cellRow].some((c) => c.value === input.newValue && c.column !== input.cellCol)
    ) {
      cell.invalid = true;
      isValid = false;
    }
    //Check columns
    if (
      gameBoard.some(
        (row) => row.at(input.cellCol)?.value === input.newValue && row !== gameBoard[input.cellRow]
      )
    ) {
      cell.invalid = true;
      isValid = false;
    }
    // Mini-square
    const startRow = boxRow * 3;
    const startCol = boxCol * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === input.cellRow && c === input.cellCol) continue;
        if (gameBoard[r][c].value === input.newValue) {
          cell.invalid = true;
          isValid = false;
        }
      }
    }
    const mistakes = isValid ? input.mistakes : Math.max(0, input.mistakes - 1);
    const apiBoard = this.convertGameBoardToApiBoard(gameBoard);
    cell.invalid = !isValid;
    const output: ValidCellOutput = {
      gameBoard: gameBoard,
      apiBoard: apiBoard,
      mistakes: mistakes,
      isValid: isValid,
    };
    return output;
  }
  isBoardComplete(gameBoard: GameBoard): boolean {
    return gameBoard.every((row) => row.every((cell) => cell.value !== 0 && !cell.invalid));
  }
  convertApiBoardToGameBoard(board: Board): GameBoard {
    const gameBoard: GameBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        value: cell,
        active: cell === 0,
        row: rowIndex,
        column: colIndex,
        invalid: false,
      }))
    );
    return gameBoard;
  }
  convertGameBoardToApiBoard(gameBoard: GameBoard): Board {
    const apiBoard: Board = gameBoard.map((row) => row.map((cell) => cell.value));
    return apiBoard;
  }
}
