import { HttpInterceptorFn } from '@angular/common/http';
import { Busy } from '../services/busy';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(Busy);
  if(req.url.includes('board')){
    busyService.busy();
    return next(req).pipe(
    delay(500),
    finalize(() => busyService.idle())
  )
  }
  return next(req);
};
