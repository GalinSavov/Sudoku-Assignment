import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Board } from '../models/board';
import { Observable } from 'rxjs';
import { BoardResponse } from '../models/boardResponse';
import { ValidateResponse } from '../models/validateResponse';
import { SolveResponse } from '../models/solveResponse';
import { BoardRequest } from '../models/boardRequest';
import { Difficulty } from '../models/difficulty';
@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  private encodeBoardRequest(request: BoardRequest): string {
    return 'board=' + encodeURIComponent(JSON.stringify(request.board));
  }
  generateData(difficulty: Difficulty) {
    let params = new HttpParams();
    params = params.append('difficulty', difficulty);
    return this.http.get<BoardResponse>(this.baseUrl + 'board', { params });
  }
  validateBoard(board: Board): Observable<ValidateResponse> {
    const body: BoardRequest = { board };
    return this.http.post<ValidateResponse>(
      this.baseUrl + 'validate',
      this.encodeBoardRequest(body),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
  }
  solveBoard(board: Board): Observable<SolveResponse> {
    const body: BoardRequest = { board };
    return this.http.post<SolveResponse>(this.baseUrl + 'solve', this.encodeBoardRequest(body), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
