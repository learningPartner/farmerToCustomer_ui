import { HttpInterceptorFn } from '@angular/common/http';
import { GlobalConstant } from '../constant/Constant';
import { environment } from '../../../environments/environment';
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
 const token = localStorage.getItem(GlobalConstant.TOKEN_KEY);
 return next(token && token !== 'undefined' && req.url.startsWith(environment.API_URL)
 ? req.clone({setHeaders: {Authorization: 'Bearer ' + token}}) : req);
};
