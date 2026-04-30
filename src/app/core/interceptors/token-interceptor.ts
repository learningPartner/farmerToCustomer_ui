import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { GlobalConstant } from '../constant/Constant';
import { catchError, map, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
  const token = localStorage.getItem(GlobalConstant.TOKEN_KEY);
  const newReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  })
  return next(newReq);
};
