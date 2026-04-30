import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { ProductMasterItem } from '../models/classes/ProductMaster.model';
import { ApiResponseModel } from '../models/interfaces/api-response.Model';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  http = inject(HttpClient);

  getAllProductMasters(): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_ALL_PRODUCT_MASTERS
    );
  }

  createProductMaster(productObj: ProductMasterItem): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      environment.API_URL + GlobalConstant.API_ENDPOINTS.CREATE_PRODUCT_MASTER,
      productObj
    );
  }

  updateProductMaster(productObj: ProductMasterItem): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(
      environment.API_URL +
        GlobalConstant.API_ENDPOINTS.UPDATE_PRODUCT_MASTER +
        productObj.productId,
      productObj
    );
  }

  deleteProductMaster(productId: number): Observable<ApiResponseModel> {
    return this.http.delete<ApiResponseModel>(
      environment.API_URL + GlobalConstant.API_ENDPOINTS.DELETE_PRODUCT_MASTER + productId
    );
  }
}
