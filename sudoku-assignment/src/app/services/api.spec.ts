import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Api } from './api';
import { environment } from '../../environments/environment.prod';
import { Difficulty } from '../models/difficulty';

describe('Api Service', () => {
  let api: Api;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Api],
    });

    api = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });

  it('should call generateData with correct URL', () => {
    const difficulty: Difficulty = 'easy';
    const dummyResponse = { board: [] };

    api.generateData(difficulty).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}board?difficulty=${difficulty}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call validateBoard with correct headers and body', () => {
    const board = Array(9).fill(Array(9).fill(0));

    const dummyResponse = { status: 'ok', valid: true };

    api.validateBoard(board).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    req.flush(dummyResponse);
  });

  it('should call solveBoard with correct headers and body', () => {
    const board = Array(9).fill(Array(9).fill(0));
    const dummyResponse = { solution: board };

    api.solveBoard(board).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}solve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    req.flush(dummyResponse);
  });
});
