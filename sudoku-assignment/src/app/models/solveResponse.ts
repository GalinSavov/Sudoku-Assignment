import { Board } from "./board"
import { Difficulty } from "./difficulty"

export type SolveResponse = {
    difficulty:Difficulty,
    solution: Board,
    status: 'solved' | 'broken' | 'unsolvable'
};