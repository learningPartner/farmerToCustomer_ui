import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe( 
      catchError((error: any)=>{ 
        if(error.status ==401) {
          alert("Token Required");
          return throwError(()=> error);
        } else if(error.status ==500) {
          alert("API Error");
          return throwError(()=> error);
        } else if(error.status ==400) {
          alert("Check Payload ");
          return throwError(()=> error);
        } else {
          return throwError(()=> error);
        }
      })
       
    );
};
