import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
 const messages = inject(MessageService);
 const users = inject(UserService); const router = inject(Router);
 return next(req).pipe(catchError(error => {
 if (error.status === 401 && req.url.startsWith(environment.API_URL) && !req.url.endsWith('/login')) {
   const returnUrl = router.url; users.logout(); router.navigate(['/login'], {queryParams:{returnUrl}});
 }
 messages.add({severity:'error', summary:'Request unsuccessful', detail: error.status === 0
 ? 'Unable to connect. Check your connection and try again.' : error.error?.message || 'Please try again.'});
 return throwError(() => error);
 }));
};
