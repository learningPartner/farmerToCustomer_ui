import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICartModel, IOrderList } from '../models/interfaces/product.interface';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { map, Observable, Subject } from 'rxjs';
import { ApiResponseModel } from '../models/interfaces/api-response.Model';
import { OrderModel } from '../models/classes/ProductMaster.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  http = inject(HttpClient);
  addtoCart$:Subject< boolean> = new Subject<boolean>;

  
   getOrdersByCustomerId(id: number) :Observable<IOrderList[]>{
    return this.http.get<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_ORDER_BY_CUSTOMER + id).pipe(
      map((res:ApiResponseModel)=> res.data)
    )
  }

   getOrdersByFarmerId(id: number) :Observable<IOrderList[]>{
    return this.http.get<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_ORDER_BY_FGARMER + id).pipe(
      map((res:ApiResponseModel)=> res.data)
    )
  }

  onSaveAddToCart(obj: ICartModel) : Observable<ApiResponseModel>{
    return this.http.post<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.ADD_TO_CART,obj)
  }

  onRmoveCart(cartId: number) : Observable<ApiResponseModel>{
    return this.http.delete<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.DELETE_CART_BY_ID + cartId)
  }


  getCartItemsByCustId(id: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(environment.API_URL+ GlobalConstant.API_ENDPOINTS.GET_CART_BY_CUST+id)
  }

   onSaveOrder(obj: OrderModel) : Observable<ApiResponseModel>{
    return this.http.post<ApiResponseModel>(environment.API_URL +GlobalConstant.API_ENDPOINTS.ORDER_SAVE,obj)
  }
}
