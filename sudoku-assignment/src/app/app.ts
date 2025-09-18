import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiTest } from './testComponents/api-test/api-test';
import { GameBoard } from './components/game-board/game-board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ApiTest,GameBoard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sudoku-assignment');
}
