import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICartModel } from '../models/interfaces/product.interface';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { Observable, Subject } from 'rxjs';
import { ApiResponseModel } from '../models/interfaces/api-response.Model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  http = inject(HttpClient);
  addtoCart$:Subject< boolean> = new Subject<boolean>;

  onSaveAddToCart(obj: ICartModel) : Observable<ApiResponseModel>{
    return this.http.post<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.ADD_TO_CART,obj)
  }

  onRmoveCart(cartId: number) : Observable<ApiResponseModel>{
    return this.http.delete<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.DELETE_CART_BY_ID + cartId)
  }


  getCartItemsByCustId(id: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(environment.API_URL+ GlobalConstant.API_ENDPOINTS.GET_CART_BY_CUST+id)
  }
}
