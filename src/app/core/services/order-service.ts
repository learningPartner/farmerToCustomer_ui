import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICartModel } from '../models/interfaces/product.interface';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/interfaces/api-response.Model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  http = inject(HttpClient)

  onSaveAddToCart(obj: ICartModel) : Observable<ApiResponseModel>{
    return this.http.post<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.ADD_TO_CART,obj)
  }
}
