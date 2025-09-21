import { Board } from "./board";
import { GameBoard } from "./gameBoard";

export type ValidCellInput = {
    gameBoard:GameBoard;
    apiBoard:Board;
    cellRow:number;
    cellCol:number;
    newValue:number;
    mistakes:number;
}