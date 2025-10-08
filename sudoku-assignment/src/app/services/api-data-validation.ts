import { Injectable } from '@angular/core';
import { Board } from '../models/board';
import { BoardResponse } from '../models/boardResponse';
import { SolveResponse } from '../models/solveResponse';
import { ValidateResponse } from '../models/validateResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiDataValidation {
  private isBoard(value: unknown): value is Board {
    return Array.isArray(value)
      && value.length === 9
      && value.every(
        (row) => Array.isArray(row)
          && row.length === 9
          && row.every((cell) => typeof cell === 'number' && Number.isInteger(cell) && cell >= 0 && cell <= 9)
      );
  }
  private isBoardResponse(value:unknown): value is BoardResponse{
    if (typeof value !=='object' || value === null) return false;
    const board = (value as {board?:unknown}).board;
    return this.isBoard(board);
  }
  private isValidateResponse(value:unknown): value is ValidateResponse{
    if(typeof value !== 'object' || value === null) return false;
    const status = (value as {status?: unknown}).status;
    return status === 'solved' || status === 'unsolved' || status === 'broken';
  }
  private isSolveResponse(value:unknown): value is SolveResponse{
    if(typeof value !== 'object' || value === null) return false;
    const obj = (value as{difficulty?:unknown,solution?:unknown,status?:unknown});
    const validDifficulty = obj.difficulty === 'easy' || obj.difficulty === 'medium' || obj.difficulty === 'hard';
    const validSolution = this.isBoard(obj.solution);
    const validStatus = obj.status === 'solved' || obj.status === 'broken' || obj.status === 'unsolved';
    return validDifficulty && validSolution && validStatus;
  }
  parseBoardResponse(value:unknown) : BoardResponse{
    if(!this.isBoardResponse(value))
      throw new Error("API returned incorrect data for generate board endpoint");
    return value;
  }
  parseValidateResponse(value:unknown): ValidateResponse{
    if(!this.isValidateResponse(value))
      throw new Error("API returned incorrect data for validate response endpoint");
    return value;
  }
  parseSolveResponse(value:unknown):SolveResponse{
    if(!this.isSolveResponse(value))
      throw new Error("API returned incorrect data for solve board endpoint");
    return value;
  }
}
