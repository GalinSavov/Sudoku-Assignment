import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameBoard } from './components/game-board/game-board';
import { Navbar } from "./components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameBoard, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sudoku-assignment');
}
