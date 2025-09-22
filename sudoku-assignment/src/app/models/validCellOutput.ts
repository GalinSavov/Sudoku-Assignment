import { Board } from "./board";
import { GameBoard } from "./gameBoard"

export type ValidCellOutput = {
    gameBoard:GameBoard;
    apiBoard:Board;
    mistakes:number;
    isValid:boolean
}