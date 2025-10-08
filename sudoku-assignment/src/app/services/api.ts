import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Board } from '../models/board';
import { map, Observable} from 'rxjs';
import { BoardResponse } from '../models/boardResponse';
import { ValidateResponse } from '../models/validateResponse';
import { SolveResponse } from '../models/solveResponse';
import { BoardRequest } from '../models/boardRequest';
import { Difficulty } from '../models/difficulty';
import { ApiDataValidation } from './api-data-validation';
@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private apiDataValidation = inject(ApiDataValidation);

  private encodeBoardRequest(request: BoardRequest): string {
    return 'board=' + encodeURIComponent(JSON.stringify(request.board));
  }
  generateData(difficulty: Difficulty):Observable<BoardResponse>{
    let params = new HttpParams();
    params = params.append('difficulty', difficulty);
    return this.http.get<BoardResponse>(this.baseUrl + 'board', { params }).pipe(
      map(row => this.apiDataValidation.parseBoardResponse(row)))
  }
  validateBoard(board: Board):Observable<ValidateResponse>{
    const body: BoardRequest = { board };
    return this.http.post<ValidateResponse>(
      this.baseUrl + 'validate',
      this.encodeBoardRequest(body),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    ).pipe(
      map(row => this.apiDataValidation.parseValidateResponse(row))
    );
  }
  solveBoard(board: Board):Observable<SolveResponse> {
    const body: BoardRequest = { board };
    return this.http.post<SolveResponse>(this.baseUrl + 'solve', this.encodeBoardRequest(body), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).pipe(
      map(row => this.apiDataValidation.parseSolveResponse(row))
    );
  }
  
}
