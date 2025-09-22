import { Difficulty } from "../../models/difficulty";

export function getMistakesPerDifficulty(difficulty:Difficulty):number{
     switch (difficulty) {
          case 'easy':
            return 4;
          case 'medium':
            return 3;
          case 'hard':
            return 2;       
          default:
            return 1;
        }
}